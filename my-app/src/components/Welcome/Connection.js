import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./connection.css";
import { QRCodeCanvas } from "qrcode.react";
import QRScanner from "./QRScanner.js";
import yu_icon from "../../assets/imgs/YU_icon/Group-48.webp";
import qrIcon from '../../assets/imgs/Icons/qrcode-icon.svg';
import { setAuthUser, getAuthUser } from "../../utils/storageUtils"; // Keep for initial load/persistence
import {
  fetchAuthUser,
  connectPartner,
  fetchPartnerUser,
} from "../../redux/usersSlice.js";

const Connection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Controls whether the code input should appear
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);

  // Value the user types (partner's code)
  const [partnerCode, setPartnerCode] = useState("");

  // Partner's name after connection
  const [connectedUserName, setConnectedUserName] = useState("");

  // Error/success messages
  const [message, setMessage] = useState("");

  // Flag to know if we've successfully connected
  const [isConnected, setIsConnected] = useState(false);

  // Controls whether the QR code scanner is visible
  const [showScanner, setShowScanner] = useState(false);

  // 1) Get authUser from Redux state (should be populated by fetchAuthUser)
  // Ensure your Redux user slice has an 'authUser' state
  const authUser = useSelector((state) => state.user.authUser); // Assuming state.user.authUser
  const partner = useSelector((state) => state.user.partnerUser);

  // Derive userCode and userName directly from Redux's authUser
  const userCode = authUser?.code || "";
  const userName = authUser?.username || "";

  // ───────────────────────────────────────────────
  // Fetch auth user on component mount and set up polling
  // ───────────────────────────────────────────────
  useEffect(() => {
    // Attempt to load from storage first if Redux state is empty
    if (!authUser) {
      const storedUser = getAuthUser();
      if (storedUser) {
        // Dispatch an action to update Redux state with the stored user
        // You'll need an action like 'setAuthUserFromStorage' in your slice
        // For simplicity, I'm just showing the dispatch here.
        // dispatch(setAuthUserFromStorage(storedUser));
        // Or, if fetchAuthUser handles initial load and persistence well:
        dispatch(fetchAuthUser()); // This should get the user from API/cookie
      }
    }

    const POLL_INTERVAL = 2000;
    const pollUser = async () => {
      try {
        const resultAction = await dispatch(fetchAuthUser());
        // If the user has a partnerId after polling, navigate
        if (resultAction.payload?.partnerId) {
          navigate("/home");
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    };

    // Run immediately and then poll
    pollUser();
    const intervalId = setInterval(pollUser, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, navigate, authUser]); // Add authUser to dependencies to re-run if it changes

  useEffect(() => {
    if (isConnected && partner && partner.username) {
      setConnectedUserName(partner.username);
    }
  }, [partner, isConnected]);

  // ───────────────────────────────────────────────
  // Toggle visibility of code input / scanner
  // ───────────────────────────────────────────────
  const handleClick = () => {
    if (showScanner) {
      setShowScanner(false);
      setTimeout(() => {
        setIsCodeInputVisible((v) => !v);
        setMessage("");
      }, 300);
    } else {
      setIsCodeInputVisible((v) => !v);
      setMessage("");
    }
  };

  const handleConfirmConnection = async () => {
    if (!partnerCode || partnerCode.trim() === "") {
      setMessage("Por favor, insira um código válido.");
      return;
    }

    try {
      // You should connect the partner *first*, then fetch the partner user
      const connectResult = await dispatch(connectPartner({ code: partnerCode }));

      if (connectPartner.fulfilled.match(connectResult)) {
        // After successful connection, fetch the partner user details
        await dispatch(fetchPartnerUser());
        setPartnerCode("");
        setIsConnected(true);
        setMessage("Conexão realizada com sucesso ✔");
      } else {
        setMessage(connectResult.payload || "Falha na ligação. Tente novamente.");
      }
    } catch (err) {
      setMessage(err.message || "Falha na ligação. Tente novamente."); // Access error message
    }
  };

  const handleNavigateToHome = () => {
    navigate("/home");
  };

  const handleScanSuccess = async (scannedCode) => {
    try {
      const connectResult = await dispatch(connectPartner({ code: scannedCode }));

      if (connectPartner.fulfilled.match(connectResult)) {
        await dispatch(fetchPartnerUser());
        setShowScanner(false);
        navigate("/home");
      } else {
        setMessage(connectResult.payload || "Falha na ligação. Tente novamente.");
        setShowScanner(false);
      }
    } catch (error) {
      setMessage(error.message || "Falha na ligação via QR. Tente novamente.");
      setShowScanner(false);
    }
  };

  return (
    <div className="connection-page mainBody">
      <h1>Cria uma ligação mútua</h1>

      {/* ... (rest of your JSX) ... */}

      {!isCodeInputVisible ? (
        <div className="connection-placeholder">
          <div className="profile-images">
            <div className="profile-item">
              <span className="profile-label">{userName || "user"}</span> {/* Use userName from Redux */}
              <img
                src={yu_icon}
                alt="User Profile"
                className="profile-img"
                loading="lazy"
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">
                {connectedUserName || "user2"}
              </span>
              <img
                src={yu_icon}
                alt="Connected User Profile"
                className={`profile-img ${
                  !connectedUserName ? "grayscale" : ""
                }`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {/* Mensagem de erro / sucesso */}
      {message && <p className="message">{message}</p>}

      {/* Botão para abrir scanner de QR ou insistir em usar input de código */}
      {!isCodeInputVisible && !showScanner && (
        <button
          className="qrconnection-button qrBtn"
          onClick={() => {
            setShowScanner(true);
            setMessage("");
          }}
        >
          <img src={qrIcon} alt="" className="qr-icon" />
          Faz scan do código QR
        </button>
      )}

      {!isCodeInputVisible && !showScanner && <p>Ou</p>}

      {/* Se não estiver conectado e não estiver mostrando scanner, exibe input de código */}
      {!isConnected && !showScanner && (
        <div className="input-section">
          <label className="input-label" htmlFor="input-connection">
            {isCodeInputVisible
              ? "Este é o teu código:"
              : "Insere o código do teu parceiro"}
          </label>

          {isCodeInputVisible ? (
            <div className="qr-section">
              <span className="generated-code">{userCode}</span> {/* Use userCode from Redux */}
              <QRCodeCanvas
                value={userCode}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
          ) : (
            <div>
              <input
                id="input-connection"
                type="text"
                className="code-input"
                placeholder="Ex: 123456"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
              />
              <button
                className="confirm-connection-button"
                onClick={handleConfirmConnection}
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Se o scanner estiver visível, renderiza o componente QRScanner */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Se já estiver conectado, oferece botão “Terminar” para ir ao home */}
      {isConnected && (
        <button className="confirm-button" onClick={handleNavigateToHome}>
          Terminar
        </button>
      )}

      {/* Rodapé: alterna entre “quero inserir código” ou “quero ver meu código” */}
      {!isConnected && (
        <p className="footer-text">
          <button
            type="button"
            className="create-link"
            onClick={handleClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "inherit",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isCodeInputVisible
              ? "Quero inserir um código."
              : "Quero mostrar o meu código."}
          </button>
          <div className="skip-section">
            <button
              type="button"
              className="skip-button"
              onClick={handleNavigateToHome}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "inherit",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Fazer a ligação mais tarde.
            </button>
          </div>
        </p>
      )}
    </div>
  );
};

export default Connection;
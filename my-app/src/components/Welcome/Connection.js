import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./connection.css";
import { QRCodeCanvas } from "qrcode.react";
import QRScanner from "./QRScanner.js";
import yu_icon from "../../assets/imgs/YU_icon/Group-48.webp";
import { getAuthUser } from "../../utils/cookieUtils";
import { connectPartner } from "../../redux/usersSlice.js";

const Connection = () => {
  const dispatch = useDispatch();
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [userName, setUserName] = useState("");
  const [connectedUserName, setConnectedUserName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  const [authUser] = useState(getAuthUser());

  useEffect(() => {
    if (authUser) {
      setUserCode(authUser.code);
      setUserName(authUser.username);
    } else {
      setMessage("Nenhum utilizador autenticado.");
    }
  }, []);

  const handleClick = () => {
    setIsCodeInputVisible(!isCodeInputVisible);
  };

  const handleConfirmConnection = () => {
    const users = "";
    const partner = "";
    const loggedInUser = "";

    const currentUser = users.find(
      (user) => user.id === parseInt(loggedInUser.id)
    );

    if (!partner) {
      setMessage("Este código não existe.");
      return;
    }

    if (partner.id === currentUser.id) {
      setMessage("Não é possível conectar contigo mesmo.");
      return;
    }

    if (partner.partnerId) {
      setMessage("Este utilizador já tem um parceiro.");
      return;
    }

    // Update partnerId for the connected users
    const updatedCurrentUser = { ...currentUser, partnerId: partner.id };
    const updatedPartner = { ...partner, partnerId: currentUser.id };

    console.log(partner.id);

    const updatedUsers = users.map((user) =>
      user.id === updatedCurrentUser.id
        ? updatedCurrentUser
        : user.id === updatedPartner.id
        ? updatedPartner
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    //* create msg object
    // dispatch(
    //   newConversation({ userId: currentUser.id, partnerId: partner.id })
    // );
    setConnectedUserName(partner.username);
    setMessage("Conexão realizada com sucesso ✔");
    setPartnerCode(""); // Clear input

    setIsConnected(true);
  };

  const handleNavigateToHome = () => {
    navigate("/home"); // Go to home after connection (or skip)
  };

  const handleScanSuccess = async (scannedCode) => {
    try {
      console.log("ok");
      const resultAction = await dispatch(
        connectPartner({ code: scannedCode })
      );
      console.log(resultAction);

      if (!resultAction.error) {
        console.log("Connection successful");
        setShowScanner(false); // 👈 hide scanner
        handleNavigateToHome();
      } else {
        console.log("Connection rejected");
        setMessage(resultAction.payload || "Falha na ligação.");
        setShowScanner(false); // 👈 hide scanner even on failure
      }
    } catch (error) {
      setMessage("Erro na ligação. Tente novamente.");
      setShowScanner(false); // 👈 also close on unknown error
    }
  };

  return (
    <div className="connection-page mainBody">
      <h1>Cria uma ligação mútua</h1>
      {/* <p className="page-desc">Cria uma ligação com alguém.</p> */}

      {!isCodeInputVisible ? (
        <div className="connection-placeholder">
          <div className="profile-images">
            <div className="profile-item">
              <span className="profile-label">{userName || "user"}</span>
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

      {/* Show message above input section */}
      {message && <p className="message">{message}</p>}

      {!isCodeInputVisible && !showScanner && (
        <button
          className="confirm-button qrBtn"
          onClick={() => setShowScanner(true)}
        >
          Faz scan do código QR
        </button>
      )}

      {!isCodeInputVisible && !showScanner && <p>Ou</p>}

      {/* Only show input section if not connected */}
      {!isConnected && !showScanner && (
        <div className="input-section">
          <label className="input-label" for="input-connection">
            {isCodeInputVisible
              ? "Este é o teu código:"
              : "Insere o código do teu parceiro"}
          </label>

          {isCodeInputVisible ? (
            <div className="qr-section">
              <span className="generated-code">{userCode}</span>
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
              {/* Button to confirm the connection */}
              {!isCodeInputVisible && (
                <button
                  className="confirm-button"
                  onClick={handleConfirmConnection}
                >
                  Confirmar
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Button remains visible during connection */}
      {isConnected && (
        <button className="confirm-button" onClick={handleNavigateToHome}>
          Terminar
        </button>
      )}

      {!isConnected && (
        <p className="footer-text">
          {isCodeInputVisible ? (
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
              Quero inserir um código.
            </button>
          ) : (
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
              Quero mostrar o meu código.
            </button>
          )}
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

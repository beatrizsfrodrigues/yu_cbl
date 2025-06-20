// src/components/Connection/Connection.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./connection.css";
import { QRCodeCanvas } from "qrcode.react";
import QRScanner from "./QRScanner.js";
import yu_icon from "../../assets/imgs/YU_icon/Group-48.webp";
import { setAuthUser, getAuthUser } from "../../utils/storageUtils";
import {
  fetchAuthUser,
  connectPartner,
  fetchPartnerUser,
} from "../../redux/usersSlice.js";

const Connection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasPolled, setHasPolled] = React.useState(false);

  // controla se o input de código deve aparecer
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);

  // valor que o utilizador digita (o código do parceiro)
  const [partnerCode, setPartnerCode] = useState("");

  // infos do próprio utilizador (do cookie)
  const [authUser] = useState(getAuthUser());
  const [userCode, setUserCode] = useState("");
  const [userName, setUserName] = useState("");

  // nome do parceiro depois de conectar
  const [connectedUserName, setConnectedUserName] = useState("");

  // mensagens de erro/sucesso
  const [message, setMessage] = useState("");

  // flag para saber se já nos conectamos com sucesso
  const [isConnected, setIsConnected] = useState(false);

  // controla se o scanner de QRCode está visível
  const [showScanner, setShowScanner] = useState(false);

  // 1) pega o parceiro do estado Redux (após um fetchPartnerUser)
  const partner = useSelector((state) => state.user.partnerUser);

  // ───────────────────────────────────────────────
  // Ao montar o componente, preenche userCode e userName
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (authUser) {
      setUserCode(authUser.code);
      setUserName(authUser.username);
    } else {
      setMessage("Nenhum utilizador autenticado.");
    }
  }, [authUser]);

  useEffect(() => {
    if (isConnected && partner && partner.username) {
      setConnectedUserName(partner.username);
    }
  }, [partner, isConnected]);

  useEffect(() => {
    let isMounted = true;
    const POLL_INTERVAL = 2000;

    const pollUser = async () => {
      try {
        // 1. Atualiza o Redux + espera o resultado
        const resultAction = await dispatch(fetchAuthUser());

        if (resultAction.payload !== authUser) {
          const freshUser = resultAction.payload;
          setAuthUser(freshUser);
          if (freshUser?.partnerId) {
            navigate("/home");
          }
        }
      } catch (err) {
        console.error("Polling falhou:", err);
      }
    };

    pollUser(); // Executa imediatamente
    const intervalId = setInterval(pollUser, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [hasPolled, navigate]);

  // ───────────────────────────────────────────────
  // Alterna entre mostrar input de código ou não
  // ───────────────────────────────────────────────
  const handleClick = () => {
    if (showScanner) {
      setShowScanner(false);
      // Aguarda desmontar o QRScanner antes de mostrar o código
      setTimeout(() => {
        setIsCodeInputVisible((v) => !v);
        setMessage("");
      }, 300); // dá tempo do QRScanner limpar câmera
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
      await dispatch(fetchPartnerUser());
      await dispatch(connectPartner({ code: partnerCode }));

      setPartnerCode("");
      setIsConnected(true);
      setMessage("Conexão realizada com sucesso ✔");
    } catch (err) {
      setMessage(err || "Falha na ligação. Tente novamente.");
    }
  };

  const handleNavigateToHome = () => {
    navigate("/home");
  };

  const handleScanSuccess = async (scannedCode) => {
    try {
      // se deu certo, fetchPartnerUser e redireciona
      await dispatch(fetchPartnerUser());
      const result = await dispatch(connectPartner({ code: scannedCode }));

      if (connectPartner.fulfilled.match(result)) {
        await dispatch(fetchPartnerUser()); // Agora faz sentido: já há parceiro ligado
        setShowScanner(false);
        navigate("/home");
      } else {
        setMessage(result.payload || "Falha na ligação. Tente novamente.");
        setShowScanner(false);
      }
    } catch (error) {
      setMessage(error || "Falha na ligação via QR. Tente novamente.");
      setShowScanner(false);
    }
  };

  return (
    <div className="connection-page mainBody">
      <h1>Cria uma ligação mútua</h1>

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

      {/* Mensagem de erro / sucesso */}
      {message && <p className="message">{message}</p>}

      {/* Botão para abrir scanner de QR ou insistir em usar input de código */}
      {!isCodeInputVisible && !showScanner && (
        <button
          className="confirm-button qrBtn"
          onClick={() => {
            setShowScanner(true);
            setMessage("");
          }}
        >
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
              <button
                className="confirm-button"
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

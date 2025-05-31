// src/components/Connection/Connection.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./connection.css";
import { QRCodeCanvas } from "qrcode.react";
import QRScanner from "./QRScanner.js";
import yu_icon from "../../assets/imgs/YU_icon/Group-48.webp";
import { getAuthUser } from "../../utils/cookieUtils";
import { connectPartner, fetchPartnerUser } from "../../redux/usersSlice.js";

const Connection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // ───────────────────────────────────────────────
  // Quando `partner` no Redux muda (após o `fetchPartnerUser`),
  // e se já estivermos em estado `isConnected = true`, atualizamos
  // o `connectedUserName` para exibir na UI.
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (isConnected && partner && partner.username) {
      setConnectedUserName(partner.username);
    }
  }, [partner, isConnected]);

  // ───────────────────────────────────────────────
  // Alterna entre mostrar input de código ou não
  // ───────────────────────────────────────────────
  const handleClick = () => {
    setIsCodeInputVisible((v) => !v);
    setMessage("");
  };

  // ───────────────────────────────────────────────
  // Disparado ao clicar em “Confirmar” no input de código
  // ───────────────────────────────────────────────
  const handleConfirmConnection = async () => {
    if (!partnerCode || partnerCode.trim() === "") {
      setMessage("Por favor, insira um código válido.");
      return;
    }

    try {
      // 1) chama o thunk connectPartner com o código inserido
      const resultAction = await dispatch(
        connectPartner({ code: partnerCode.trim() })
      ).unwrap();

      // Se `unwrap()` não lançar erro, significa que a ligação foi bem‐sucedida.
      // Aqui `resultAction` é o payload que o seu “connect-partner” devolve
      // (normalmente o utilizador atualizado com partnerId preenchido).

      // 2) Disparamos o fetchPartnerUser para que o Redux carregue os dados completos
      //    do parceiro recém‐conectado (username, mascot, accessoriesEquipped, etc.).
      await dispatch(fetchPartnerUser());

      // 3) Agora impostamos o flag que diz “já estamos conectados” e limpamos o input
      setPartnerCode("");
      setIsConnected(true);
      setMessage("Conexão realizada com sucesso ✔");
    } catch (err) {
      // Se a promise foi rejeitada, `err` conterá a mensagem de falha do backend
      setMessage(err || "Falha na ligação. Tente novamente.");
    }
  };

  const handleNavigateToHome = () => {
    navigate("/home");
  };

  const handleScanSuccess = async (scannedCode) => {
    try {
      const resultAction = await dispatch(
        connectPartner({ code: scannedCode })
      ).unwrap();

      // se deu certo, fetchPartnerUser e redireciona
      await dispatch(fetchPartnerUser());
      setShowScanner(false);
      navigate("/home");
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
              ? "Quero mostrar o meu código."
              : "Quero inserir um código."}
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

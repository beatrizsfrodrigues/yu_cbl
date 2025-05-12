import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMessages, newConversation } from "../../redux/messagesSlice";
import "./connection.css";
import { QRCodeCanvas } from "qrcode.react";
import yu_icon from "../../assets/imgs/YU_icon/Group-48.webp";

const Connection = () => {
  const dispatch = useDispatch();
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [userName, setUserName] = useState("");
  const [connectedUserName, setConnectedUserName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesStatus = useSelector((state) => state.messages.status);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (messagesStatus === "idle") {
  //     dispatch(fetchMessages());
  //   }
  // }, [messagesStatus, dispatch]);

  // Fetch LocalStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser && loggedInUser.id) {
      const currentUser = users.find(
        (user) => user.id === parseInt(loggedInUser.id)
      );

      if (currentUser) {
        setUserCode(currentUser.code);
        setUserName(currentUser.username);
      } else {
        setUserCode("Nenhum código encontrado, por favor registar.");
        setUserName("Utilizador desconhecido.");
      }
    } else {
      setMessage("Nenhum utilizador autenticado.");
    }
  }, []);

  const handleClick = () => {
    setIsCodeInputVisible(!isCodeInputVisible);
  };

  const handleConfirmConnection = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const partner = users.find((user) => user.code === partnerCode);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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

  return (
    <div className="connection-page mainBody">
      <h1>Cria uma ligação mútua</h1>
      <p className="page-desc">
        Nesta fase, cria uma ligação com alguém para atribuirem tarefas entre
        si.
      </p>

      <div className="connection-placeholder">
        <div className="profile-images">
          <div className="profile-item">
            <span className="profile-label">{userName}</span>
            <img
              src={yu_icon}
              alt="User Profile"
              className="profile-img"
              loading="lazy"
            />
          </div>
          <div className="profile-item">
            <span className="profile-label">
              {connectedUserName || ". . ."}
            </span>
            <img
              src={yu_icon}
              alt="Connected User Profile"
              className={`profile-img ${!connectedUserName ? "grayscale" : ""}`}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Show message above input section */}
      {message && <p className="message">{message}</p>}

      {/* Only show input section if not connected */}
      {!isConnected && (
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
            <input
              id="input-connection"
              type="text"
              className="code-input"
              placeholder="Insere o teu código..."
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value)}
            />
          )}

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

      {/* Button remains visible during connection */}
      {isConnected && (
        <button className="confirm-button" onClick={handleNavigateToHome}>
          Terminar
        </button>
      )}

      {!isConnected && (
        <p className="footer-text">
          {isCodeInputVisible
            ? "Insere o código do teu parceiro"
            : "Ou partilha o teu código"}{" "}
          <a href="#" className="create-link" onClick={handleClick}>
            aqui.
          </a>
          <div class="skip-section">
            <a href="#" className="skip-button" onClick={handleNavigateToHome}>
              Fazer a ligação mais tarde.
            </a>
          </div>
        </p>
      )}
    </div>
  );
};

export default Connection;

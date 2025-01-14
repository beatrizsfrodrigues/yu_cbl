import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./connection.css";
import yu_icon from "../../assets/imgs/YU_icon/Group 48.svg";

const Connection = () => {
    const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
    const [userCode, setUserCode] = useState(null);
    const [userName, setUserName] = useState("");
    const [connectedUserName, setConnectedUserName] = useState("");
    const [partnerCode, setPartnerCode] = useState("");
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    // Fetch LocalStorage
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (loggedInUser && loggedInUser.id) {
            const currentUser = users.find(user => user.id === parseInt(loggedInUser.id));

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

        const currentUser = users.find(user => user.id === parseInt(loggedInUser.id));

        if (!partner) {
            setMessage("Este código não existe.");
            return;
        }

        if (partner.id === currentUser.id) {
            setMessage("Não é possível conectar contigo mesmo.");
            return;
        }

        // Update partnerID for the connected users
        const updatedCurrentUser = { ...currentUser, partnerID: partner.id };
        const updatedPartner = { ...partner, partnerID: currentUser.id };

        const updatedUsers = users.map((user) =>
            user.id === updatedCurrentUser.id
                ? updatedCurrentUser
                : user.id === updatedPartner.id
                    ? updatedPartner
                    : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        setConnectedUserName(partner.username);
        setMessage("Conexão realizada com sucesso ✔");
        setPartnerCode(""); // Clear input

        setIsConnected(true);
    };

    const handleNavigateToHome = () => {
        navigate("/home"); // Go to home after connection
    };

    return (
        <div className="connection-page">
            <p className="page-title">Cria uma ligação mútua</p>
            <p className="page-desc">
                Nesta fase, cria uma ligação com alguém para atribuirem tarefas entre si.
            </p>

            <div className="connection-placeholder">
                <div className="profile-images">
                    <div className="profile-item">
                        <span className="profile-label">{userName}</span>
                        <img
                            src={yu_icon}
                            alt="User Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">
                            {connectedUserName || ". . ."}
                        </span>
                        <img
                            src={yu_icon}
                            alt="Connected User Profile"
                            className={`profile-img ${!connectedUserName ? 'grayscale' : ''}`}
                        />
                    </div>
                </div>
            </div>

            {/* Show message above input section */}
            {message && <p className="message">{message}</p>}

            {/* Only show input section if not connected */}
            {!isConnected && (
                <div className="input-section">
                    <label className="input-label">
                        {isCodeInputVisible ? "Este é o teu código:" : "Insere o código do teu parceiro"}
                    </label>

                    {isCodeInputVisible ? (
                        <span className="generated-code">{userCode}</span>
                    ) : (
                        <input
                            type="text"
                            className="code-input"
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value)}
                        />
                    )}

                    {/* Button to confirm the connection */}
                    {!isCodeInputVisible && (
                        <button className="confirm-button" onClick={handleConfirmConnection}>
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
                    {isCodeInputVisible ? "Insere o código do teu parceiro" : "Ou partilha o teu código"}{" "}
                    <a href="#" className="create-link" onClick={handleClick}>
                        aqui.
                    </a>
                </p>
            )}

        </div>
    );
};

export default Connection;

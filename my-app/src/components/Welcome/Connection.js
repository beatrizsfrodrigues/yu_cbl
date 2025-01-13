import React, { useState, useEffect } from "react";
import "./connection.css";

const Connection = () => {

    const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
    const [userCode, setUserCode] = useState(null);
    const [partnerCode, setPartnerCode] = useState("");
    const [message, setMessage] = useState("");

    // Fetch LocalStorage
    useEffect(() => {
        const storedCode = localStorage.getItem("code");
        if (storedCode) {
            setUserCode(storedCode);
        } else {
            setUserCode("No code found. Please register."); // If there's no code, register
        }
    }, []);

    const handleClick = () => {
        setIsCodeInputVisible(!isCodeInputVisible);
    };

    const handleConfirmConnection = () => {
        // Fetch from local storage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const partner = users.find((user) => user.code === partnerCode);
        const currentUser = users.find((user) => user.code === userCode);

        if (!partner) {
            setMessage("Código do parceiro não encontrado");
            return;
        }

        if (partner.id === currentUser.id) {
            setMessage("Não é possível conectar contigo mesmo");
            return;
        }

        // Update partnerID for the connected users
        const updatedCurrentUser = { ...currentUser, partnerID: partner.id };
        const updatedPartner = { ...partner, partnerID: currentUser.id };

        // Save changes in local storage
        const updatedUsers = users.map((user) =>
            user.id === updatedCurrentUser.id ? updatedCurrentUser : user.id === updatedPartner.id ? updatedPartner : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        setMessage("Conexão realizada com sucesso!");
        setPartnerCode(""); // Clear input
    };

    return (
        <div className="connection-page">
            <p className="page-title">Cria uma ligação mútua</p>
            <p className="page-desc">
                Nesta fase, cria uma ligação com uma segunda pessoa para a atribuição de tarefas.
            </p>

            <div className="connection-placeholder">
                <span className="profile-label">Luísa</span>
                <div className="profile-images">
                    <div className="profile-img"></div>
                    <div className="profile-img profile-placeholder"></div>
                </div>
            </div>

            <div className="input-section">
                <label className="input-label">
                    {isCodeInputVisible ? "Partilha este código" : "Insere o código do teu parceiro"}
                </label>

                {isCodeInputVisible ? (
                    <span className="generated-code">{userCode}</span>
                ) : (
                    <input
                        type="text"
                        className="code-input"
                        value={partnerCode}
                        onChange={(e) => setPartnerCode(e.target.value)}
                        placeholder="Insira o código"
                    />
                )}

                {/* Button to confirm the connection */}
                {!isCodeInputVisible && (
                    <button className="confirm-button" onClick={handleConfirmConnection}>
                        Confirmar
                    </button>
                )}
            </div>

            {message && <p className="message">{message}</p>}

            <p className="footer-text">
                {isCodeInputVisible ? "Insere o código do parceiro" : "Ou partilha o teu código"}{" "}
                <a href="#" className="create-link" onClick={handleClick}>
                    aqui.
                </a>
            </p>
        </div>
    );
};

export default Connection;
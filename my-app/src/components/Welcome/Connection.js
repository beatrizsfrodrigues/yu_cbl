import React from "react";
import "./connection.css";

const Connection = () => {

    return (
        <div className="connection-page">

            {/* Título da página */}
            <p className="page-title">Cria uma ligação mútua</p>
            <p className="page-desc">
                Nesta fase, cria uma ligação com uma segunda pessoa para a atribuição de tarefas.
            </p>

            {/* Ícones de perfil (colocar num componente separado) */}
            <div className="connection-placeholder">
                <span className="profile-label">Luísa</span>
                <div className="profile-images">
                    <div className="profile-img"></div>
                    <div className="profile-img profile-placeholder"></div>
                </div>
            </div>

            {/* Input e botão */}
            <div className="input-section">
                <label className="input-label">Insere o teu código</label>
                <input
                    type="text"
                    className="code-input"
                />
                <button className="confirm-button">Confirmar</button>
            </div>

            <p className="footer-text">
                Não tens um código? <a href="#" className="create-link">Cria o teu.</a>
            </p>
        </div>
    );
};

export default Connection;

import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../Perfil/profile.css";



const Profile = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="profile-container">
      {/* Header com título e ícone */}
      <header className="profile-header">
        <h1 className="profile-title">Perfil</h1>
        <span className="gear-icon bi bi-gear" onClick={toggleSettings}></span>
      </header>

      {/* Parte principal do perfil */}
      <div className="profile-avatar">
        <img src="/assets/img/YU_cores/YU-roxo.svg" alt="Avatar" className="avatar-image" />
        <h2 className="profile-name">Luísa</h2>
      </div>

      {/* Botões abaixo do nome */}
      <div className="profile-buttons">
        <button className="profile-button award">
          <i className="bi bi-award"></i>
        </button>
        
        <button className="profile-button circle">
          <Link to="/informacoes">
          <i className="bi bi-info-circle"></i>
          </Link>
        </button>
    
        <button className="profile-button dots">
          <i className="bi bi-chat-dots"></i>
        </button>
      </div>

      {/* Modal de definições */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-header">
            <h2>Definições</h2>
            <button className="close-button" onClick={toggleSettings}>
              ✕
            </button>
          </div>
          <hr />
          <div className="settings-section">
            <h3>A tua conta</h3>
            <button className="settings-button">Informação pessoal</button>
            <button className="settings-button">Arquivo</button>
            <button className="settings-button">Amigo</button>
            <button className="settings-button">Comunidade</button>
          </div>
          <div className="settings-section">
            <h3>Saídas</h3>
            <Link to="/login">
              <button className="settings-button logout">Sair</button>
            </Link>
            <button className="settings-button delete-account">
              Apagar conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
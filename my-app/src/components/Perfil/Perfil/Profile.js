import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../Perfil/profile.css";
import Definicoes from "../Definicoes/Definicoes";
import InfoPessoal from "../Definicoes/InfoPessoal";


const Profile = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInfoPessoal, setShowInfoPessoal] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleInfoPessoalClick = () => {
    setShowInfoPessoal(true);
    setShowSettings(false); // Fecha o modal de definições
  };

  const closeSettings = () => {
    setShowSettings(false);
  };
  const backToSettings = () => {
    setShowInfoPessoal(false); // Fecha o modal de InfoPessoal
    setShowSettings(true);
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

      <Definicoes
        show={showSettings}
        onClose={closeSettings}
        onInfoPessoalClick={handleInfoPessoalClick}
      />

      <InfoPessoal 
        show={showInfoPessoal} 
        onBack={backToSettings} />


       
    </div>
  );
};

export default Profile;
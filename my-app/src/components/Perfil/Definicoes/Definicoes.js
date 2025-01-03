import React from "react";
import { Link } from "react-router-dom";
import "../Definicoes/Definicoes.css";

const Definicoes = ({ show, onClose, onInfoPessoalClick }) => {
  if (!show) return null;  

  return (
    <div className="settings-modal">
      <div className="settings-header">
        <h2>Definições</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
      <hr />
      <div className="settings-section">
        <h3>A tua conta</h3>
        <button className="settings-button" onClick={onInfoPessoalClick}>
          Os meus dados
        </button>
        <button className="settings-button">Arquivo</button>
        <button className="settings-button">Amigo</button>
        <button className="settings-button">Comunidade</button>
      </div>
      <div className="settings-section">
        <h3>Saídas</h3>
        <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
          <button className="settings-button logout">Sair</button>
        </Link>
        <button className="settings-button delete-account">Apagar conta</button>
      </div>
    </div>
  );
};

export default Definicoes;

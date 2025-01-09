import React from "react";
import { Link } from "react-router-dom";
import "../Definicoes/Definicoes.css";

const Definicoes = ({ show, onClose, onInfoPessoalClick }) => {
  if (!show) return null;  

  return (
    <div className="modal">
 
          <div className="window" >
          <div className="settings-header">
            <h2>Definições</h2>
            
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="line"></div>

          <div className="settings-section" style={{ display: 'block' }} >
            <h3>A tua conta</h3>
            <button className="settings-button" onClick={onInfoPessoalClick}>
              Os meus dados
            </button>
            <button className="settings-button">Arquivo</button>
            <button className="settings-button">Amigo</button>
            <button className="settings-button">Comunidade</button>
          </div>
          <div className="settings-section" style={{ display: 'block' }}>
            <h3>Saídas</h3>
            <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
              <button className="settings-button logout">Sair</button>
            </Link>
            <button className="settings-button delete-account">Apagar conta</button>
            <br></br>
          </div>

      </div>  

  </div>
  );
};

export default Definicoes;

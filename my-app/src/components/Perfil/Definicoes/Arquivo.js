import React from "react";
import "../Definicoes/Definicoes.css";

const Arquivo = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="window">
        <div className="settings-header">
          <h2>Arquivo</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="line"></div>
        <div className="settings-section" style={{ display: "block" }}>
          <h3>Arquivo de tarefas concluídas</h3>
          {/* O conteúdo */}
        </div>
      </div>
    </div>
  );
};

export default Arquivo;

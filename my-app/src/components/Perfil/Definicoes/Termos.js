// Termos.js
import React from "react";
import "../Definicoes/Definicoes.css";

 

const Termos = ({
 show = false,
  onClose = () => {},
 onOpenPrivacidade = () => {},
  onOpenTermosUso = () => {}    
}) => { if (!show) return null; 

  return (
    <div className="modal modal-termos" onClick={onClose}>
      <div className="window" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <ion-icon name="chevron-back-outline" onClick={onClose} className="icons" style={{ fontSize: "28px" }}/>
          
          <h3>Termos e Condições</h3>
        </div>

        <div className="line" />

        <div className="settings-content">
          <div className="settings-section">
            <h3>Sobre a YU</h3>
            <button className="settings-button" onClick={onOpenPrivacidade}>
              Política de Privacidade
            </button>
             <button className="settings-button" onClick={onOpenTermosUso}>
              Termos de Uso
            </button>
              
            {/* Conteúdo adicional dos Termos */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Termos;
import React from "react";



const Grafico = ({ show, onClose }) => {
  if (!show) return null;  

  return (
    <div className="settings-modal">
      <div className="settings-header">
        <h2>Gráfico</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
      <hr />
      <div className="settings-section">
        <h3>A tua conta</h3>
        
         
      </div>
       
    </div>
  );
};

export default Grafico;

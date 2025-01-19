import React, {} from "react";

function PopUpInfo({ onClose, message }) {
  return (
    <div className="modal">
      <div className="popup">
        <p dangerouslySetInnerHTML={{ __html: message }}></p>
        <button className="submitBtn" onClick={onClose}>
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default PopUpInfo;

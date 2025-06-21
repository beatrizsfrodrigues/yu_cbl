import React from "react";

function PopUpInfo({ onClose, message }) {
  return (
    <div className="modal" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <div className="popup">
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
          <button
            aria-label="fechar popup"
            className="submitBtn"
            onClick={onClose}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUpInfo;

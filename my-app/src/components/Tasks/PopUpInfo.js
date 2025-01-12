import React, { useEffect, useState } from "react";

function PopUpInfo({ onClose, message }) {
  return (
    <div className="modal">
      <div className="popup">
        <p>texto</p>
        <button className="submitBtn">Confirmar</button>
      </div>
    </div>
  );
}

export default PopUpInfo;

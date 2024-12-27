import React, { useEffect, useState } from "react";
import { X } from "react-feather";

function Messages({ onClose }) {
  return (
    <div className="modal">
      <div className="window">
        <div>
          <h3>@amigo</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <div id="textSpace"></div>
        <input placeholder="Deixa uma mensagem"></input>
      </div>
    </div>
  );
}

export default Messages;

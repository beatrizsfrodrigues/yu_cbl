import React from "react";
import "../assets/css/Register.css"; // Adds the necessary styles

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ion-icon
          name="close-outline"
          onClick={onClose}
          class="icons"
        ></ion-icon>
        {children}
      </div>
    </div>
  );
};

export default Modal;

import React, { useState } from "react";
import VerifyTask from "./VerifyTask.js";

function VerifyPopUp({ onClose, partnerUser, task, onVerify }) {
  const [isVerifyTaskOpen, setIsVerifyTaskOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleOpenVerifyTaskModal = () => {
    onClose();
    onVerify();
  };

  const handleCloseVerifyTaskModal = () => {
    setIsVerifyTaskOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".popup")) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300); // Remove o efeito após 300ms
    }
  };

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className={`popup ${isFlashing ? "flash" : ""}`}>
        <p>
          <b>@{partnerUser.username}</b> concluiu a tarefa <b>{task.title}</b>
        </p>
        <button
          className="submitBtn"
          onClick={() => handleOpenVerifyTaskModal(task)}
        >
          Verificar
        </button>
        <p className="laterLink" onClick={onClose}>
          Lembrar mais tarde
        </p>
      </div>
      {isVerifyTaskOpen && (
        <VerifyTask
          onClose={handleCloseVerifyTaskModal}
          partnerUser={partnerUser}
          task={task}
        />
      )}
    </div>
  );
}

export default VerifyPopUp;

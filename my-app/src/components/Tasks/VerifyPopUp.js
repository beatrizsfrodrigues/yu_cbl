import React, { useState } from "react";
import VerifyTask from "./VerifyTask.js";

function VerifyPopUp({ onClose, partnerUser, task, onVerify }) {
  const [isVerifyTaskOpen, setIsVerifyTaskOpen] = useState(false);

  const handleOpenVerifyTaskModal = () => {
    onClose();
    onVerify();
  };

  const handleCloseVerifyTaskModal = () => {
    setIsVerifyTaskOpen(false);
  };

  return (
    <div className="modal">
      <div className="popup">
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

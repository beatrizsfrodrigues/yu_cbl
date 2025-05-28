import React, { useState } from "react";
import VerifyTask from "./VerifyTask.js";
import { useDispatch } from "react-redux";
import { notifyTasks } from "../../redux/taskSlice.js";

function VerifyPopUp({ onClose, partnerUser, task, onVerify }) {
  const [isVerifyTaskOpen, setIsVerifyTaskOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const dispatch = useDispatch();

  const handleOpenVerifyTaskModal = () => {
    onClose();
    onVerify();
  };

  const handleCloseVerifyTaskModal = () => {
    setIsVerifyTaskOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".popup")) {
      onClose();
    }
  };

  const handleClosePopUp = (task) => {
    onClose();
    dispatch(notifyTasks(task._id));
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
        <p
          className="submitBtn orangeBtn"
          onClick={() => handleClosePopUp(task)}
        >
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

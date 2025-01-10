import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeTask, validateTask } from "../../redux/usersSlice";

function VerifyTask({ onClose, partnerUser, task }) {
  const dispatch = useDispatch();

  const handleVerifyTask = (e) => {
    e.preventDefault();

    dispatch(validateTask({ userId: partnerUser.id, task }));
    onClose(e);
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Verificação da tarefa</h3>
        </div>
        <div className="line"></div>
        <div id="concludeTaskDiv">
          <h5 className="titleTask">{task.title}</h5>
          <img id="proofImage" src="" alt={task.picture} />
        </div>
        <div id="btnGroupDiv">
          <button className="submitBtn" onClick={handleVerifyTask}>
            Aceitar
          </button>
          <button className="submitBtn orangeBtn">Rejeitar</button>
        </div>
      </div>
    </div>
  );
}

export default VerifyTask;

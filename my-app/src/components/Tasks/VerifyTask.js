import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeTask, validateTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";
import PopUpInfo from "./PopUpInfo.js";

function VerifyTask({ onClose, partnerUser, task }) {
  const dispatch = useDispatch();

  const handleVerifyTask = (e) => {
    e.preventDefault();

    dispatch(validateTask({ userId: partnerUser.id, task }));

    dispatch(
      sendNotification({
        senderId: partnerUser.partnerId,
        receiverId: partnerUser.id,
        text: `Tarefa <b>${task.title}</b> foi validada! Recebeste 10 pontos!`,
      })
    );

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
          <img
            id="proofImage"
            src={`/imgsForUpload/${task.picture}`}
            alt={task.picture}
          />
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

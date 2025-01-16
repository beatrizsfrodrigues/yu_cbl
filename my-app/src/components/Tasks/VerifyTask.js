import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function VerifyTask({ onClose, partnerUser, task, onShowPopUpInfo, onReject }) {
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

    onClose();
    onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi validada com sucesso.`);
  };

  const handleRejectTask = (e) => {
    e.preventDefault();
    onClose();
    onReject({ task, partnerUser });
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
            //! folder with images while we don't have a bd
            src={`/imgsForUpload/${task.picture}`}
            alt={task.picture}
          />
        </div>
        <div id="btnGroupDiv">
          <button className="submitBtn" onClick={handleVerifyTask}>
            Aceitar
          </button>
          <button className="submitBtn orangeBtn" onClick={handleRejectTask}>
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyTask;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rejectTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";
import PopUpInfo from "./PopUpInfo.js";

function Reject({ onClose, task, partnerUser, onShowPopUpInfo }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const handleRejectTask = (e) => {
    e.preventDefault();

    dispatch(rejectTask({ userId: partnerUser.id, task, message }));

    dispatch(
      sendNotification({
        senderId: partnerUser.partnerId,
        receiverId: partnerUser.id,
        text: `Tarefa <b>${task.title}</b> foi rejeitada.`,
      })
    );

    onClose();

    onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi rejeitada.`);
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Rejeição da tarefa</h3>
        </div>
        <div className="line"></div>
        <p>
          Rejeitaste a submissão do teu parceiro. Por favor deixa uma mensagem
          para que ele perceba o que pode melhorar no futuro.
        </p>
        <form id="rejectForm">
          <label className="label">Deixa uma mensagem:</label>
          <input
            type="text"
            className="input"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="submitBtn"
            id="sendReject"
            onClick={handleRejectTask}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reject;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  rejectTask,
  createNewTaskAfterRejection,
} from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function Reject({
  onClose,
  task,
  partnerUser,
  onShowPopUpInfo,
  onRequestNewTask,
}) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [rejected, setRejected] = useState(false);

  const handleRejectTask = async (e) => {
    e.preventDefault();

    // 1. Rejeita a tarefa
    dispatch(rejectTask({ userId: partnerUser.id, task, message }));

    // 2. Cria nova tarefa automaticamente
    await dispatch(createNewTaskAfterRejection({ userId: partnerUser.id }));

    // 3. Envia notificação ao parceiro
    dispatch(
      sendNotification({
        senderId: partnerUser.partnerId,
        receiverId: partnerUser.id,
        text: `Tarefa <b>${task.title}</b> foi rejeitada.`,
      })
    );

    // 4. Mostra popup de confirmação
    onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi rejeitada.`);

    // 5. (Opcional) Pede nova tarefa manualmente
    onRequestNewTask?.();

    // 6. Fecha modal
    onClose();

    // 7. Atualiza estado
    setRejected(true);
  };

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target.classList.contains("modal")) {
          onClose();
        }
      }}
    >
      <div className="window">
        <div className="header">
          <h3>Rejeição da tarefa</h3>
          <button
            className="close-button"
            aria-label="Fechar janela"
            onClick={onClose}
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        <div className="line"></div>

        {!rejected ? (
          <>
            <p>
              Rejeitaste a submissão do teu parceiro. <br />
              Por favor deixa uma mensagem para que ele perceba porque é que foi
              rejeitada. <br />
              Não te esqueças de pedir uma nova tarefa!
            </p>
            <form id="rejectForm" onSubmit={handleRejectTask}>
              <label className="label">Deixa uma mensagem:</label>
              <input
                type="text"
                className="input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="submitBtn" type="submit">
                Pedir nova tarefa
              </button>
            </form>
          </>
        ) : (
          <>
            <p>A tarefa foi rejeitada com sucesso.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Reject;

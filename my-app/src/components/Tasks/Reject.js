import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { rejectTask } from "../../redux/usersSlice";
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

    onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi rejeitada.`);
    setRejected(true);
  };

  return (
    <div
      className="modal"
      onClick={(e) => {
        // Fecha se clicar fora da window
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
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="submitBtn"
                onClick={() => {
                  onRequestNewTask?.();
                  onClose();
                }}
              >
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

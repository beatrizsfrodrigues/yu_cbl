import React from "react";
import { useDispatch } from "react-redux";
import { verifyTask } from "../../redux/taskSlice.js";

function VerifyTask({
  onClose,
  partnerUser,
  task,
  onShowPopUpInfo,
  onReject,
  onTaskVerified,
}) {
  const dispatch = useDispatch();

  if (!task) {
    return null;
  }

  const handleVerifyTask = async (e) => {
    e.preventDefault();

    try {
      const verifiedTask = await dispatch(
        verifyTask({ id: task._id, rejectMessage: "", verify: true })
      ).unwrap();

      if (onTaskVerified) {
        onTaskVerified(verifiedTask); // Passa a task atualizada
      }

      onClose();
      onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi validada com sucesso.`);
    } catch (error) {
      onShowPopUpInfo(`Erro ao validar a tarefa <b>${task.title}</b>.`);
    }
  };

  const handleRejectTask = (e) => {
    e.preventDefault();
    onClose();
    onReject(task); // Pass only the task object for rejection
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Verificação da tarefa</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            class="icons"
          ></ion-icon>
        </div>
        <div className="line"></div>
        <div id="concludeTaskDiv">
          <h5 className="titleTask">{task.title}</h5>
          <img id="proofImage" src={task.picture} alt={task.picture} />
        </div>
        <div id="btnGroupDiv">
          <button
            className="submitBtn"
            onClick={handleVerifyTask}
            aria-label="Aceitar tarefa"
          >
            Aceitar
          </button>
          <button
            className="submitBtn orangeBtn"
            onClick={handleRejectTask}
            aria-label="Rejeitar tarefa"
          >
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyTask;

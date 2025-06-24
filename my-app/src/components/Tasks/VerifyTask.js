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

    console.log(task);

    await dispatch(
      verifyTask({ id: task._id, rejectMessage: "", verify: true })
    ).unwrap();

    const updatedTask = {
      task,
      completed: true,
      verified: true,
      rejectMessage: "",
    };

    if (onTaskVerified) {
      onTaskVerified(updatedTask);
    }

    onClose();
    onShowPopUpInfo(`Tarefa <b>${task.title}</b> foi validada com sucesso.`);
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

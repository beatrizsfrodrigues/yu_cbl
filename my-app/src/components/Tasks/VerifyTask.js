import React from "react";
import { useDispatch } from "react-redux";
import { verifyTask } from "../../redux/taskSlice.js";

function VerifyTask({ onClose, partnerUser, task, onShowPopUpInfo, onReject }) {
  const dispatch = useDispatch();
  if (!task) {
    return null; // or a loader/message while waiting for task to be set
  }

  const handleVerifyTask = (e) => {
    e.preventDefault();

    dispatch(verifyTask({ id: task._id, rejectMessage: "", verify: true }));

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

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, UploadCloud, RefreshCw } from "react-feather";
import { completeTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function ConcludeTask({ onClose, currentUser, task, onShowPopUpInfo }) {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    dispatch(
      completeTask({
        taskId: task.id,
        proofImage: selectedFile.name,
        userId: currentUser.id,
      })
    );

    dispatch(
      sendNotification({
        senderId: currentUser.id,
        receiverId: currentUser.partnerId,
        text: `Tarefa <b>${task.title}</b> foi marcada como concluída.`,
      })
    );
    onClose();
    onShowPopUpInfo(
      `Tarefa <b>${task.title}</b> foi marcada como concluída. Espera pela verificação para obteres pontos.`
    );
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Concluir tarefa</h3>
          <button
            className="closeWindow"
            onClick={onClose}
            aria-label="Fechar janela"
          >
            <X aria-label="Fechar janela" />
          </button>
        </div>
        <div className="line"></div>
        <div id="concludeTaskDiv">
          <h5 className="titleTask">{task.title}</h5>
          <div id="proofImage">
            {preview ? (
              <div>
                <img src={preview} alt="Proof" />
                <button
                  aria-label="Recarregar imagem"
                  htmlFor="fileInput"
                  className="btnRound"
                  id="retakePhoto"
                >
                  <RefreshCw />
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </button>
              </div>
            ) : (
              <label htmlFor="fileInput" className="fileInputLabel">
                <UploadCloud id="iconRetake" />
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <p id="infoUpload">
                  Faz upload de uma imagem como prova para o teu amigo!
                </p>
              </label>
            )}
          </div>

          <button
            className="submitBtn"
            onClick={handleSubmit}
            aria-label="Submeter prova de tarefa"
          >
            Submeter
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConcludeTask;

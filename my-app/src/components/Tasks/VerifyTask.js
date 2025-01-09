import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud, RefreshCw } from "react-feather";
import { completeTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function VerifyTask({ onClose }) {
  //   const dispatch = useDispatch();
  //   const [selectedFile, setSelectedFile] = useState(null);
  //   const [preview, setPreview] = useState(null);

  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     setSelectedFile(file);

  //     // Create a preview of the uploaded image
  //     console.log(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //     };
  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleSubmit = () => {
  //     dispatch(
  //       completeTask({
  //         taskId: task.id,
  //         proofImage: selectedFile.name,
  //         userId: currentUser.id,
  //       })
  //     );

  //     dispatch(
  //       sendNotification({
  //         senderId: currentUser.id,
  //         receiverId: currentUser.partnerId,
  //         text: `Tarefa <b>${task.title}</b> foi marcada como concluída.`,
  //       })
  //     );
  //     onClose();
  //   };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Verificação da tarefa</h3>
          {/* <X className="closeWindow" onClick={onClose} /> */}
        </div>
        <div className="line"></div>
        <div id="concludeTaskDiv">
          <h5 className="titleTask">Titulo</h5>
          <img id="proofImage" src="" alt="Proof" />
        </div>
        <div id="btnGroupDiv">
          <button className="submitBtn">Aceitar</button>
          <button className="submitBtn orangeBtn">Rejeitar</button>
        </div>
        {/* <div id="concludeTaskDiv">
          <h5 className="titleTask">{task.title}</h5>
          <div id="proofImage">
            {preview ? (
              <div>
                <img src={preview} alt="Proof" style={{ width: "100%" }} />
                <label
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
                </label>
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

          <button className="submitBtn" onClick={handleSubmit}>
            Submeter
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default VerifyTask;

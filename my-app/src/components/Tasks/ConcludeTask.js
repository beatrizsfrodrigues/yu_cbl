import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { UploadCloud, RefreshCw } from "react-feather";
import { completeTask } from "../../redux/taskSlice.js";

// Add onTaskConcluded to the destructured props
function ConcludeTask({ onClose, currentUser, task, onShowPopUpInfo, onTaskConcluded }) {
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      onShowPopUpInfo("Por favor, seleciona uma imagem como prova.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(selectedFile);

      // Dispatch the completeTask action and wait for it to finish
      // Assuming completeTask action creator updates Redux state and potentially returns the updated task
      await dispatch(
        completeTask({ picture: imageUrl, id: task._id })
      ).unwrap(); // Use .unwrap() to handle success/failure of the async thunk

      // Construct the updated task object locally for immediate UI feedback.
      // This is crucial because your Redux state/polling might take a moment to update.
      const updatedTask = {
        ...task,
        completed: true,  // Mark as completed
        picture: imageUrl // Update with the new image URL
        // verified should remain false at this stage
      };

      // Call the callback function passed from the parent with the updated task
      if (onTaskConcluded) {
        onTaskConcluded(updatedTask);
      }

      onClose(); // Close the modal
      onShowPopUpInfo(
        `Tarefa <b>${task.title}</b> foi marcada como concluída. Espera pela verificação para obteres pontos.`
      );
    } catch (err) {
      console.error("Erro ao fazer upload para Cloudinary ou concluir tarefa:", err);
      // More specific error message for upload vs. task completion
      const errorMessage = err.message || "Ocorreu um erro.";
      onShowPopUpInfo(`Falha ao concluir a tarefa. Tenta novamente: ${errorMessage}`);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "task_image"); // Replace with your actual upload preset

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dinzra2oo/image/upload", // Replace with your actual Cloudinary cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erro no upload para Cloudinary.");
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary hosted image URL
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Concluir tarefa</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            class="icons"
          ></ion-icon>
        </div>
        <div className="line"></div>
        <div id="concludeTaskDiv">
          <h5 className="titleTask">{task.title}</h5>
          <div id="proofImage">
            {preview ? (
              <div>
                <img src={preview} alt="Proof" />
                <label
                  htmlFor="fileInput"
                  className="btnRound"
                  id="retakePhoto"
                  aria-label="Recarregar imagem"
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
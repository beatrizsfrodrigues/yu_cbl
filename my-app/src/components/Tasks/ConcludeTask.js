import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "react-feather";
import { completeTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function ConcludeTask({ onClose, currentUser, task }) {
  const currentUserId = 1;
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create a preview of the uploaded image
    console.log(file);
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
        userId: currentUserId,
      })
    );

    dispatch(
      sendNotification({
        senderId: currentUserId,
        receiverId: currentUser.partnerId,
        text: "Tarefa concluída com sucesso!",
      })
    );
    onClose();
  };

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Concluir tarefa</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <h4>{task.title}</h4>
        <div className="proofImage">
          {preview ? (
            <img src={preview} alt="Proof" style={{ width: "100%" }} />
          ) : (
            "No image uploaded"
          )}
        </div>
        <input type="file" onChange={handleFileChange} />
        <button className="submitBtn" onClick={handleSubmit}>
          Submeter
        </button>
      </div>
    </div>
  );
}

export default ConcludeTask;

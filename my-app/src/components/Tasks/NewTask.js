import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "react-feather";
import { fetchUsers, addTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";
import PopUpInfo from "./PopUpInfo.js";

function NewTask({ onClose, currentUser }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    const partnerId = currentUser.partnerId;

    dispatch(addTask({ title, description, partnerId }));

    dispatch(
      sendNotification({
        senderId: currentUser.id,
        receiverId: currentUser.partnerId,
        text: `Tarefa <b>${title}</b> foi criada.`,
      })
    );

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="modal">
      <div className="window">
        <div>
          <h3>Nova tarefa</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <form id="newTaskForm" onSubmit={handleAddTask}>
          <label className="label">Título</label>
          <input
            type="text"
            className="input"
            placeholder="Dá um título à tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="label">Descrição</label>
          <textarea
            className="input descriptionInput"
            placeholder="Descreve a tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button type="submit" className="button buttonBig">
            Criar
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTask;

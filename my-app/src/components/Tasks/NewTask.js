import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "react-feather";
import { fetchUsers, addTask } from "../../redux/usersSlice";

function NewTask({ onClose, currentUser }) {
  const currentUserId = 1;
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = (e) => {
    const partnerId = currentUser.partnerId;
    e.preventDefault(); // Prevent default form submission
    dispatch(addTask({ title, description, partnerId }));
    setTitle(""); // Clear the input fields
    setDescription("");
    onClose(); // Close the modal
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

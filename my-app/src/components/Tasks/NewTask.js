import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "react-feather";
import { addTask } from "../../redux/usersSlice";
import { sendNotification } from "../../redux/messagesSlice";

function NewTask({ onClose, currentUser, onShowPopUpInfo }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (currentUser.partnerId) {
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
      onShowPopUpInfo(`Tarefa <b>${title}</b> foi criada com sucesso.`);
    } else {
      onShowPopUpInfo(`Cria uma ligação para criares tarefas!`);
    }
  };

  const isFormComplete = title.trim() !== "" && description.trim() !== "";

  return (
    <div className="modal">
      <div className="window">
        <div>
          <h3>Nova tarefa</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <form id="newTaskForm" onSubmit={handleAddTask}>

          <label className="label">
            Título <span className="alert">*</span>

          </label>
          <input
            required
            type="text"
            className="input"
            placeholder="Dá um título à tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="label">
            Descrição <span className="alert">*</span>
          </label>

          <textarea
            required
            className="input descriptionInput"
            placeholder="Descreve a tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="button buttonBig"
            disabled={!isFormComplete}
            aria-label="Fechar janela"
          >

            Criar
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTask;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "react-feather";
import { addTask } from "../../redux/taskSlice.js";

function NewTask({ onClose, currentUser, onShowPopUpInfo }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    console.log(currentUser);
    if (!currentUser) {
      onShowPopUpInfo?.("Erro: utilizador não definido.");
      return;
    }

    if (currentUser.partnerId) {
      dispatch(addTask({ title, description }));

      setTitle("");
      setDescription("");
      onClose?.();
      onShowPopUpInfo?.(`Tarefa <b>${title}</b> foi criada com sucesso.`);
    } else {
      onShowPopUpInfo?.(`Cria uma ligação para criares tarefas!`);
    }
  };

  const isFormComplete = title.trim() !== "" && description.trim() !== "";

  return (
    <div className="modal">
      <div className="window slide-up">
        <div className="header">
          <h3>Nova tarefa</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            class="icons"
          ></ion-icon>
        </div>
        <div className="line"></div>
        <form id="newTaskForm" onSubmit={handleAddTask}>
          <label className="label" for="input_titulo">
            Título <span className="alert">*</span>
          </label>
          <input
            id="input_title"
            required
            type="text"
            className="input"
            placeholder="Dá um título à tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="label" for="textarea_description">
            Descrição <span className="alert">*</span>
          </label>

          <textarea
            id="textarea_description"
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

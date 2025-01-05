import React, { useEffect, useState } from "react";
import { X } from "react-feather";

function NewTask({ onClose }) {
  return (
    <div className="modal">
      <div className="window">
        <div>
          <h3>Nova tarefa</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <form id="newTaskForm">
          <label className="label">Título</label>
          <input
            type="text"
            className="input"
            placeholder="Dá um título à tarefa"
          />
          <label className="label">Descrição</label>
          <textarea
            className="input descriptionInput"
            placeholder="Descreve a tarefa"
          ></textarea>
          <button className="button buttonBig">Criar</button>
        </form>
      </div>
    </div>
  );
}

export default NewTask;

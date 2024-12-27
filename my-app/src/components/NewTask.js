import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/usersSlice.js";
import { X } from "react-feather";

function NewTask({ onClose }) {
  return (
    <div className="modal">
      <div className="window">
        <div>
          <h3>Nova tarefa</h3>
          <X onClick={onClose} />
        </div>
        <div className="line"></div>
        <form id="newTaskForm">
          <label className="label">Título</label>
          <input type="text" className="input" placeholder="Título" />
          <label className="label">Título</label>
          <textarea className="input" placeholder="Descrição"></textarea>
          <button className="button buttonBig">Criar</button>
        </form>
      </div>
    </div>
  );
}

export default NewTask;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "react-feather";
import { fetchUsers, addTask } from "../../redux/usersSlice";

function ConcludeTask({ onClose, currentUser, task }) {
  const currentUserId = 1;
  const dispatch = useDispatch();

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>Concluir tarefa</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <h4>{task.title}</h4>
        <div className="proofImage">imagem</div>
        <button className="submitBtn">Submeter</button>
      </div>
    </div>
  );
}

export default ConcludeTask;

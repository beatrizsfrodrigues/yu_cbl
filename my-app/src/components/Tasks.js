import React from "react";
import "../assets/css/tasks.css";

const Tasks = () => {
  return (
    <div className="mainBody">
      <h1>Lista de Tarefas</h1>
      <div id="tasks">
        <div className="taskDiv">
          <p className="taskTitle">Tarefa</p>
        </div>
        <div className="taskDiv">
          <p className="taskTitle">Tarefa</p>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/usersSlice.js";
import "./tasks.css";
import NewTask from "./NewTask.js";
import Messages from "./Messages.js";
import ConcludeTask from "./ConcludeTask.js";
import { MessageCircle, Plus, Sliders, X } from "react-feather";

function Tasks() {
  const currentUserId = 1;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [toggledTaskIndex, setToggledTaskIndex] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isConcludeTaskOpen, setIsConcludeTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  const handleTaskClick = (index) => {
    setToggledTaskIndex(toggledTaskIndex === index ? null : index);
  };

  //* open and close new task window
  const handleOpenNewTaskModal = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
  };

  //* open and close messages window
  const handleOpenMessagesModal = () => {
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  //* open and close conclude task window
  const handleOpenConcludeTaskModal = (task) => {
    setSelectedTask(task);
    setIsConcludeTaskOpen(true);
  };

  const handleCloseConcludeTaskModal = () => {
    setIsConcludeTaskOpen(false);
  };

  if (usersStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (usersStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  const currentUser =
    users && users.length > 0
      ? users.find((user) => user.id == currentUserId)
      : null;

  return (
    <div className="mainBody" id="tasksBody">
      <div className="header">
        <h1>Lista de Tarefas</h1>
        <Sliders className="sliders" />
      </div>
      <div id="tasks">
        {currentUser && currentUser.tasks.length > 0 ? (
          currentUser.tasks.map((task, index) => (
            <div className="taskDivOp">
              <div
                key={index}
                className={`taskDiv ${
                  toggledTaskIndex === index ? "toggled" : ""
                }`}
                onClick={() => handleTaskClick(index)}
              >
                <p className="taskTitle">
                  {toggledTaskIndex === index ? task.description : task.title}
                </p>
              </div>
              <button
                className="doneTask"
                onClick={() => handleOpenConcludeTaskModal(task)}
              >
                Concluir
              </button>
            </div>
          ))
        ) : (
          <div>Não existem tarefas disponiveis.</div>
        )}
      </div>
      <button
        id="newTask"
        className="btnRound"
        onClick={handleOpenNewTaskModal}
      >
        <Plus />
      </button>
      <button
        id="textBtn"
        className="btnRound"
        onClick={handleOpenMessagesModal}
      >
        <MessageCircle />
      </button>
      {isNewTaskModalOpen && (
        <NewTask onClose={handleCloseNewTaskModal} currentUser={currentUser} />
      )}
      {isMessagesModalOpen && (
        <Messages
          onClose={handleCloseMessagesModal}
          currentUser={currentUser}
        />
      )}
      {isConcludeTaskOpen && (
        <ConcludeTask
          onClose={handleCloseConcludeTaskModal}
          currentUser={currentUser}
          task={selectedTask}
        />
      )}
    </div>
  );
}

export default Tasks;

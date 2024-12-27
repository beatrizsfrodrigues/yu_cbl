import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/usersSlice.js";
import "../assets/css/tasks.css";
import NewTask from "./NewTask.js";
import Messages from "./Messages.js";
import { MessageCircle, Plus } from "react-feather";

function Tasks() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [toggledTaskIndex, setToggledTaskIndex] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUser());
    }
  }, [usersStatus, dispatch]);

  const handleTaskClick = (index) => {
    setToggledTaskIndex(toggledTaskIndex === index ? null : index);
  };

  const handleOpenNewTaskModal = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
  };

  const handleOpenMessagesModal = () => {
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  if (usersStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (usersStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mainBody" id="tasksBody">
      <h1>Lista de Tarefas</h1>
      <div id="tasks">
        {users && users.length > 0 ? (
          users[0].tasks.map((task, index) => (
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
          ))
        ) : (
          <div>Não existem tarefas</div>
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
      {isNewTaskModalOpen && <NewTask onClose={handleCloseNewTaskModal} />}
      {isMessagesModalOpen && <Messages onClose={handleCloseMessagesModal} />}
    </div>
  );
}

export default Tasks;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/usersSlice.js";
import "../assets/css/tasks.css";
import NewTask from "./NewTask.js";
import { MessageCircle, Plus } from "react-feather";

function Tasks() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [toggledTaskIndex, setToggledTaskIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUser());
    }
  }, [usersStatus, dispatch]);

  const handleTaskClick = (index) => {
    setToggledTaskIndex(toggledTaskIndex === index ? null : index);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <button id="newTask" className="btnRound" onClick={handleOpenModal}>
        <Plus />
      </button>
      <button id="textBtn" className="btnRound">
        <MessageCircle />
      </button>
      {isModalOpen && <NewTask onClose={handleCloseModal} />}
    </div>
  );
}

export default Tasks;

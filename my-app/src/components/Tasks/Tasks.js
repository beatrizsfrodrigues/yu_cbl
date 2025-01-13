import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/usersSlice.js";
import { fetchMessages } from "../../redux/messagesSlice";
import "./tasks.css";
import NewTask from "./NewTask.js";
import Messages from "./Messages.js";
import ConcludeTask from "./ConcludeTask.js";
import VerifyTask from "./VerifyTask.js";
import VerifyPopUp from "./VerifyPopUp.js";
import PopUpInfo from "./PopUpInfo.js";
import Filter from "./Filter.js";
import Reject from "./Reject.js";
import { MessageCircle, Plus, Sliders } from "react-feather";

function Tasks() {
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const messages = useSelector((state) => state.messages.data);
  const messagesStatus = useSelector((state) => state.messages.status);
  const [toggledTaskIndex, setToggledTaskIndex] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isConcludeTaskOpen, setIsConcludeTaskOpen] = useState(false);
  const [isVerifyTaskOpen, setIsVerifyTaskOpen] = useState(false);
  const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [showVerifyTask, setShowVerifyTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToVerify, setTaskToVerify] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [partnerUser, setPartnerUser] = useState(null);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("porConcluir");

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  //* fetch text messages
  useEffect(() => {
    if (messagesStatus === "idle") {
      dispatch(fetchMessages());
    }
  }, [messagesStatus, dispatch]);

  useEffect(() => {
    const user =
      users && users.length > 0
        ? users.find((user) => user.id == currentUserId)
        : null;
    setCurrentUser(user);

    const partner =
      users && users.length > 0
        ? users.find((u) => u.id == user.partnerId)
        : null;

    if (partner) {
      setPartnerUser(partner);

      const task = partner.tasks.find(
        (task) => task.completed && !task.verified
      );
      if (task) {
        setTaskToVerify(task);
        if (partner) {
          setShowVerifyTask(true);
        }
      } else {
        setShowVerifyTask(false);
      }
    }
  }, [users, currentUserId]);

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

  //* open and close verify task modal
  const handleOpenVerifyTaskModal = () => {
    setShowVerifyTask(false);
    setIsVerifyTaskOpen(true);
  };

  const handleCloseVerifyTaskModal = () => {
    setIsVerifyTaskOpen(false);
  };

  //* open and close pop-up info
  const handleClosePopUpInfo = () => {
    setIsPopUpInfoOpen(false);
  };

  const handleShowPopUpInfo = (message) => {
    setPopUpMessage(message);
    setIsPopUpInfoOpen(true);
  };

  //* change task filter
  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };

  const handleOpenRejectModal = () => {
    setIsRejectOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectOpen(false);
  };

  const filteredTasks = currentUser
    ? currentUser.tasks.filter((task) => {
        if (filterCriteria === "todas") {
          return true;
        } else if (filterCriteria === "concluidas") {
          return task.completed && task.verified;
        } else if (filterCriteria === "porConcluir") {
          return !task.completed && !task.verified;
        } else if (filterCriteria === "espera") {
          return task.completed && !task.verified;
        }
      })
    : [];

  if (usersStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (usersStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mainBody" id="tasksBody">
      <div className="header">
        <h1>Lista de Tarefas</h1>
        <Sliders onClick={() => setIsFilterOpen(true)} className="sliders" />
      </div>
      <div id="tasks">
        {currentUser && filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) =>
            !task.completed && !task.verified ? (
              <div className="taskDivOp" key={index}>
                <div
                  className={`taskDiv ${
                    toggledTaskIndex === index ? "toggled" : ""
                  }`}
                  onClick={() => handleTaskClick(index)}
                >
                  <p className="taskTitle">
                    {toggledTaskIndex === index ? task.description : task.title}
                  </p>
                </div>
                {!task.completed && !task.verified && (
                  <button
                    className="doneTask"
                    onClick={() => handleOpenConcludeTaskModal(task)}
                  >
                    Concluir
                  </button>
                )}
              </div>
            ) : (
              <div className="taskDivOp " key={index}>
                <div
                  className={`taskDiv taskDone ${
                    toggledTaskIndex === index ? "toggled" : ""
                  }`}
                  onClick={() => handleTaskClick(index)}
                >
                  <p className="taskTitle ">
                    {toggledTaskIndex === index ? task.description : task.title}
                  </p>
                </div>
              </div>
            )
          )
        ) : (
          <div>Não existem tarefas disponíveis.</div>
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

      {showVerifyTask && partnerUser && (
        <VerifyPopUp
          task={taskToVerify}
          partnerUser={partnerUser}
          onClose={() => setShowVerifyTask(false)}
          onVerify={handleOpenVerifyTaskModal}
        />
      )}
      {isVerifyTaskOpen && (
        <VerifyTask
          onClose={handleCloseVerifyTaskModal}
          partnerUser={partnerUser}
          task={taskToVerify}
          onShowPopUpInfo={handleShowPopUpInfo}
          onReject={handleOpenRejectModal}
        />
      )}
      {isNewTaskModalOpen && (
        <NewTask
          onClose={handleCloseNewTaskModal}
          currentUser={currentUser}
          onShowPopUpInfo={handleShowPopUpInfo}
        />
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
          onShowPopUpInfo={handleShowPopUpInfo}
        />
      )}
      {isPopUpInfoOpen && (
        <PopUpInfo onClose={handleClosePopUpInfo} message={popUpMessage} />
      )}
      {isFilterOpen && (
        <Filter
          filterCriteria={filterCriteria}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
      {isRejectOpen && (
        <Reject
          onClose={handleCloseRejectModal}
          task={taskToVerify}
          partnerUser={partnerUser}
          onShowPopUpInfo={handleShowPopUpInfo}
        />
      )}
    </div>
  );
}

export default Tasks;

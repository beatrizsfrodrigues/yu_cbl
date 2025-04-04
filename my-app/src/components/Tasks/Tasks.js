import React, { useEffect, useState, Suspense, lazy } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, clearRejectMessage } from "../../redux/usersSlice.js";
import { fetchMessages } from "../../redux/messagesSlice";
import "./tasks.css";
import { MessageCircle, Plus, Sliders } from "react-feather";

// import NewTask from "./NewTask.js";
// import Messages from "./Messages.js";
// import ConcludeTask from "./ConcludeTask.js";
// import VerifyTask from "./VerifyTask.js";
// import VerifyPopUp from "./VerifyPopUp.js";
// import PopUpInfo from "../PopUpInfo.js";
// import Filter from "./Filter.js";
// import Reject from "./Reject.js";

const ConcludeTask = lazy(() => import("./ConcludeTask.js"));
const VerifyTask = lazy(() => import("./VerifyTask.js"));
const NewTask = lazy(() => import("./NewTask.js"));
const Messages = lazy(() => import("./Messages.js"));
const VerifyPopUp = lazy(() => import("./VerifyPopUp.js"));
const PopUpInfo = lazy(() => import("../PopUpInfo.js"));
const Filter = lazy(() => import("./Filter.js"));
const Reject = lazy(() => import("./Reject.js"));

function Tasks() {
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const messagesStatus = useSelector((state) => state.messages.status);
  const openFilter = useCallback(() => setIsFilterOpen(true), []);
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
  const [swipedTask, setSwipedTask] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveX, setTouchMoveX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false); // Track actual swipe

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
        ? users.find((user) => user.id === currentUserId)
        : null;
    setCurrentUser(user);

    const rejectedTask =
      users && users.length > 0
        ? user.tasks.find((task) => task.rejectMessage !== "")
        : null;
    if (rejectedTask) {
      handleShowPopUpInfo(
        `Tarefa <b>${rejectedTask.title}</b> foi rejeita. Tenta outra vez.`
      );

      dispatch(
        clearRejectMessage({ userId: user.id, taskId: rejectedTask.id })
      );
    }

    const partner =
      users && users.length > 0
        ? users.find((u) => u.id === user.partnerId)
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
  }, [users, currentUserId, dispatch]);

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

  //* open and close verify task window
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

  //* open and close reject task window
  const handleOpenRejectModal = () => {
    setIsRejectOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectOpen(false);
  };

  const handleTouchStart = (index, e) => {
    setTouchStartX(e.touches[0].clientX);
    setSwipedTask(index);
  };

  const handleTouchMove = (e) => {
    setTouchMoveX(e.touches[0].clientX);
  };
  // teste

  const handleTouchEnd = () => {
    if (swipedTask !== null) {
      const swipeDistance = touchStartX - touchMoveX;
      const taskElement = document.getElementById(`task-${swipedTask}`);

      if (swipeDistance > 50 && touchMoveX !== 0) {
        // Swipe Left
        taskElement.classList.add("swiped");
        taskElement.classList.remove("reset");
      } else if (swipeDistance < -50) {
        // Swipe Right (Undo Swipe)
        taskElement.classList.remove("swiped");
        taskElement.classList.add("reset");
      }

      setTimeout(() => {
        taskElement.classList.remove("reset"); // Ensure smooth transition
      }, 300);
    }
    setSwipedTask(null);
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
        return false;
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
      <div className="backgroundDiv"></div>

      <header className="header">
        <h1 className="title" aria-label="Lista de Tarefas">
          Lista de Tarefas
        </h1>

        <button onClick={openFilter}  aria-label="Abrir filtro">
          <Sliders className="sliders"/>
        </button>
      </header>

      <div id="tasks">
        {currentUser && filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) =>
            !task.completed && !task.verified ? (
              <div className="taskDivOp">
                <div className="btnTaskGroup">
                  <button className="btnTask" disabled={!isSwiping}>
                    Recusar
                  </button>
                  <button className="btnTask" disabled={!isSwiping}>
                    Concluir
                  </button>
                </div>
                <div className="btnTaskGroup">
                  <button className="btnTask">Recusar</button>
                  <button
                    className="btnTask"
                    onClick={() => handleOpenConcludeTaskModal(task)}
                  >
                    Concluir
                  </button>
                </div>
                <div
                  key={index}
                  id={`task-${index}`}
                  className="taskWrap"
                  onTouchStart={(e) => handleTouchStart(index, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="taskDiv">
                    <p className="taskTitle">{task.title}</p>{" "}
                  </div>
                </div>
              </div>
            ) : (
              // <div className="taskDivOp" key={index}>
              //   <div
              //     className={`taskDiv ${
              //       toggledTaskIndex === index ? "toggled" : ""
              //     }`}
              //     onClick={() => handleTaskClick(index)}
              //   >
              //     <p className="taskTitle">
              //       {toggledTaskIndex === index ? (
              //         task.description
              //       ) : (
              //         <b>{task.title}</b>
              //       )}
              //     </p>
              //   </div>
              //   {!task.completed && !task.verified && (
              //     <button
              //       className="doneTask"
              //       onClick={() => handleOpenConcludeTaskModal(task)}
              //     >
              //       Concluir
              //     </button>
              //   )}
              // </div>
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
        aria-label="Botão para adicionar nova tarefa"
        id="newTask"
        className="btnRound"
        onClick={handleOpenNewTaskModal}
      >
        <i class="bi bi-plus"></i>
      </button>

      <button
        aria-label="Botão para abrir mensagens"
        id="textBtn"
        className="btnRound"
        onClick={handleOpenMessagesModal}
      >
        <i className="bi bi-chat-dots"></i>
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

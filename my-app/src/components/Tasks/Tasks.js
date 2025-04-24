import React, { useEffect, useState, Suspense, lazy } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, clearRejectMessage } from "../../redux/usersSlice.js";
import { getTasks } from "../../redux/taskSlice.js";
import TopBar from "../TopBar.js";
import "./tasks.css";

const ConcludeTask = lazy(() => import("./ConcludeTask.js"));
const VerifyTask = lazy(() => import("./VerifyTask.js"));
const NewTask = lazy(() => import("./NewTask.js"));
const VerifyPopUp = lazy(() => import("./VerifyPopUp.js"));
const PopUpInfo = lazy(() => import("../PopUpInfo.js"));
const Filter = lazy(() => import("./Filter.js"));
const Reject = lazy(() => import("./Reject.js"));

function Tasks() {
  const dispatch = useDispatch();
  const { data: tasks, status } = useSelector((state) => state.tasks); // Ensure `state.tasks` matches the key used in the store configuration.

  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const messagesStatus = useSelector((state) => state.messages.status);
  const openFilter = useCallback(() => setIsFilterOpen(true), []);
  const [toggledTaskIndex, setToggledTaskIndex] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
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
  const [partnerTasks, setPartnerTasks] = useState([]);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("porConcluir");
  const [filter, setFilter] = useState("received");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [swipedTask, setSwipedTask] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveX, setTouchMoveX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false); // Track actual swipe
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && tasks) {
      const filtered = tasks.filter((task) => {
        const isReceived =
          filter === "received" && task.userId === currentUser.id;
        const isAssigned =
          filter === "assigned" &&
          partnerUser &&
          task.userId === partnerUser.id;

        const matchesCriteria =
          filterCriteria === "todas" ||
          (filterCriteria === "concluidas" &&
            task.completed &&
            task.verified) ||
          (filterCriteria === "porConcluir" &&
            !task.completed &&
            !task.verified) ||
          (filterCriteria === "espera" && task.completed && !task.verified);

        return (isReceived || isAssigned) && matchesCriteria;
      });

      setFilteredTasks(filtered);
    }
  }, [tasks, filter, filterCriteria, currentUser, partnerUser]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

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
  const handleTaskFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };

  //* open and close reject task window
  const handleOpenRejectModal = (task) => {
    setTaskToVerify(task);
    setIsRejectOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectOpen(false);
    setTaskToVerify(null);
  };

  if (usersStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (usersStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!tasks) {
    return <div>Loading...</div>;
  }

  const handleRequestNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  <Reject
    onClose={handleCloseRejectModal}
    task={taskToVerify}
    partnerUser={partnerUser}
    onShowPopUpInfo={handleShowPopUpInfo}
    onRequestNewTask={handleRequestNewTask}
  />;

  const handleToggleTaskExpand = (index) => {
    setExpandedTaskIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mainBody" id="tasksBody">
      <div className="backgroundDiv"></div>
      <TopBar title="Tarefas">
        <button onClick={openFilter} aria-label="Abrir filtro">
          <ion-icon name="options-outline" class="icons"></ion-icon>
        </button>
      </TopBar>

      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === "received" ? "active" : ""}`}
          onClick={() => handleFilterChange("received")}
        >
          Recebidas
        </button>
        <span className="divider">|</span>
        <button
          className={`filter-button ${filter === "assigned" ? "active" : ""}`}
          onClick={() => handleFilterChange("assigned")}
        >
          Atribuídas
        </button>
      </div>

      <div id="tasks">
        {currentUser && filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div className="taskDivOp" key={index}>
              {!task.completed && !task.verified ? (
                <div className="taskItemContainer">
                  <button
                    className={`task-item ${
                      expandedTaskIndex === index ? "expanded" : ""
                    }`}
                    onClick={() => handleToggleTaskExpand(index)}
                  >
                    <p className="taskTitle">{task.title}</p>

                    {/* ✅ Mostra a descrição abaixo do título quando expandido */}
                    {expandedTaskIndex === index && (
                      <p className="taskDescription">
                        Descrição:<br></br>
                        {task.description}
                      </p>
                    )}
                  </button>

                  {expandedTaskIndex === index && (
                    <div className="btnTaskGroupVertical">
                      <button
                        className="btnTaskCircle reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRejectModal(task);
                        }}
                        aria-label="Recusar tarefa"
                      >
                        <ion-icon name="close" class="icons"></ion-icon>
                      </button>
                      <button
                        className="btnTaskCircle conclude"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenConcludeTaskModal(task);
                        }}
                        aria-label="Concluir tarefa"
                      >
                        <ion-icon name="checkmark" class="icons"></ion-icon>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`taskDiv taskDone ${
                    toggledTaskIndex === index ? "toggled" : ""
                  }`}
                  onClick={() => handleTaskClick(index)}
                >
                  <p className="taskTitle">
                    {toggledTaskIndex === index ? task.description : task.title}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>
            {filter === "received"
              ? "Não existem tarefas recebidas."
              : "Não existem tarefas atribuídas."}
          </div>
        )}
      </div>

      <button
        aria-label="Botão para adicionar nova tarefa"
        id="newTask"
        className="profile-button"
        onClick={handleOpenNewTaskModal}
      >
        <ion-icon name="add-outline" class="iconswhite"></ion-icon>
      </button>

      {/* Modais (sem alterações) */}
      {showVerifyTask && partnerUser && (
        <Suspense fallback={<div>Loading rejeição...</div>}>
          <VerifyPopUp
            task={taskToVerify}
            partnerUser={partnerUser}
            onClose={() => setShowVerifyTask(false)}
            onVerify={handleOpenVerifyTaskModal}
          />
        </Suspense>
      )}
      {isVerifyTaskOpen && (
        <Suspense fallback={<div>Loading nova tarefa...</div>}>
          <VerifyTask
            onClose={handleCloseVerifyTaskModal}
            partnerUser={partnerUser}
            task={taskToVerify}
            onShowPopUpInfo={handleShowPopUpInfo}
            onReject={handleOpenRejectModal}
          />
        </Suspense>
      )}
      {isNewTaskModalOpen && (
        <Suspense fallback={<div>Loading nova tarefa...</div>}>
          <NewTask
            onClose={handleCloseNewTaskModal}
            currentUser={currentUser}
            onShowPopUpInfo={handleShowPopUpInfo}
          />
        </Suspense>
      )}
      {isConcludeTaskOpen && (
        <Suspense fallback={<div>Loading nova tarefa...</div>}>
          <ConcludeTask
            onClose={handleCloseConcludeTaskModal}
            currentUser={currentUser}
            task={selectedTask}
            onShowPopUpInfo={handleShowPopUpInfo}
          />
        </Suspense>
      )}
      {isPopUpInfoOpen && (
        <Suspense fallback={<div>Loading rejeição...</div>}>
          <PopUpInfo onClose={handleClosePopUpInfo} message={popUpMessage} />
        </Suspense>
      )}
      {isFilterOpen && (
        <Suspense fallback={<div>Loading rejeição...</div>}>
          <Filter
            filterCriteria={filterCriteria}
            onFilterChange={handleTaskFilterChange}
            onClose={() => setIsFilterOpen(false)}
          />
        </Suspense>
      )}
      {isRejectOpen && (
        <Suspense fallback={<div>Loading rejeição...</div>}>
          <Reject
            onClose={handleCloseRejectModal}
            task={taskToVerify}
            partnerUser={partnerUser}
            onShowPopUpInfo={handleShowPopUpInfo}
          />
        </Suspense>
      )}
    </div>
  );
}

export default Tasks;

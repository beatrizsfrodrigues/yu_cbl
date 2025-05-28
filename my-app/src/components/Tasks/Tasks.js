import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, removeRejectMessage } from "../../redux/taskSlice.js";
import { getAuthUser } from "../../utils/cookieUtils";
import { fetchPartnerUser } from "../../redux/usersSlice.js";
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
  const tasksState = useSelector((state) => state.tasks || {});

  const {
    data: tasks = [],
    status: tasksStatus,
    error: tasksError,
  } = tasksState;

  const [authUser] = useState(getAuthUser());

  const [currentUser, setCurrentUser] = useState(false);
  const [partnerUser, setPartnerUser] = useState(false);

  const openFilter = useCallback(() => setIsFilterOpen(true), []);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isConcludeTaskOpen, setIsConcludeTaskOpen] = useState(false);
  const [isVerifyTaskOpen, setIsVerifyTaskOpen] = useState(false);
  const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [showVerifyTask, setShowVerifyTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToVerify, setTaskToVerify] = useState(null);

  const [popUpMessage, setPopUpMessage] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("porConcluir");
  const [filter, setFilter] = useState("received");
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [partnerTasks, setPartnerTasks] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      const fetchTasks = async () => {
        try {
          const myResult = await dispatch(getTasks(authUser._id)).unwrap();
          if (JSON.stringify(myResult) !== JSON.stringify(myTasks)) {
            setMyTasks(myResult || []);
          }
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        }
      };
      fetchTasks();
    }
  }, [authUser?._id, dispatch, myTasks]);

  useEffect(() => {
    if (authUser?.partnerId) {
      const fetchPartner = async () => {
        try {
          const result = await dispatch(
            fetchPartnerUser(authUser.partnerId)
          ).unwrap();
          if (JSON.stringify(result) !== JSON.stringify(partnerUser)) {
            setPartnerUser(result || {});
          }
        } catch (err) {
          console.error("Failed to fetch partner user:", err);
        }
      };

      fetchPartner();
    }
  }, [authUser?.partnerId, dispatch, partnerUser]);

  useEffect(() => {
    if (partnerUser?._id) {
      const fetchTasks = async () => {
        try {
          const result = await dispatch(getTasks(partnerUser._id)).unwrap();
          if (JSON.stringify(result) !== JSON.stringify(partnerTasks)) {
            setPartnerTasks(result || []);
          }
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        }
      };
      fetchTasks();
    }
  }, [partnerUser?._id, dispatch, partnerTasks]);

  useEffect(() => {
    const POLL_INTERVAL = 15000; // 15 seconds

    const pollTasks = async () => {
      try {
        if (authUser?._id) {
          const myResult = await dispatch(getTasks(authUser._id)).unwrap();
          if (JSON.stringify(myResult) !== JSON.stringify(myTasks)) {
            setMyTasks(myResult || []);
          }
        }

        if (partnerUser?._id) {
          const partnerResult = await dispatch(
            getTasks(partnerUser._id)
          ).unwrap();
          if (JSON.stringify(partnerResult) !== JSON.stringify(partnerTasks)) {
            setPartnerTasks(partnerResult || []);
          }
        }
      } catch (err) {
        console.error("Failed to poll tasks:", err);
      }
    };

    const intervalId = setInterval(pollTasks, POLL_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [authUser?._id, partnerUser?._id, dispatch, myTasks, partnerTasks]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const rejectedTask = tasks.find((task) => task.rejectMessage !== "");
      if (rejectedTask && rejectedTask.userId === authUser?._id) {
        handleShowPopUpInfo(
          `Tarefa <b>${rejectedTask.title}</b> foi rejeita. Tenta outra vez.`
        );
        dispatch(removeRejectMessage(rejectedTask._id));
      }
    }
  }, [tasks, authUser?._id, dispatch]);

  const filteredTasks = useMemo(() => {
    const baseTasks = filter === "received" ? myTasks : partnerTasks;
    return baseTasks.filter((task) => {
      const isReceived = filter === "received" && task.userId === authUser._id;
      const isAssigned =
        filter === "assigned" &&
        partnerUser?._id &&
        task.userId === partnerUser._id;

      const matchesCriteria =
        filterCriteria === "todas" ||
        (filterCriteria === "concluidas" && task.completed && task.verified) ||
        (filterCriteria === "porConcluir" &&
          !task.completed &&
          !task.verified) ||
        (filterCriteria === "espera" && task.completed && !task.verified);

      return (isReceived || isAssigned) && matchesCriteria;
    });
  }, [
    filter,
    filterCriteria,
    myTasks,
    partnerTasks,
    authUser._id,
    partnerUser?._id,
  ]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  useEffect(() => {
    setCurrentUser(authUser); // You may not even need this if it's just copying state

    const fetchPartner = async () => {
      if (!authUser?.partnerId) return;
      try {
        const resultAction = await dispatch(
          fetchPartnerUser(authUser.partnerId)
        );
        if (resultAction.payload) {
          setPartnerUser(resultAction.payload);
        }
      } catch (err) {
        console.error("Failed to fetch partner user:", err);
      }
    };

    fetchPartner();
  }, [authUser?.partnerId, dispatch, authUser]); // ✅ use only stable dependencies

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

  if (tasksStatus === "loading") {
    return <div>Loading tarefas…</div>;
  }

  if (tasksStatus === "failed") {
    return <div>Error: {tasksError}</div>;
  }

  if (!tasks) {
    return <div>A carregar...</div>;
  }

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
              <div className="taskItemContainer">
                <button
                  className={`task-item ${
                    expandedTaskIndex === index ? "expanded" : ""
                  }`}
                  onClick={() => handleToggleTaskExpand(index)}
                >
                  <p className="taskTitle">{task.title}</p>
                  {expandedTaskIndex === index && (
                    <p className="taskDescription">
                      Descrição:<br></br>
                      {task.description}
                    </p>
                  )}
                </button>
                {expandedTaskIndex === index &&
                  !task.completed &&
                  !task.verified &&
                  task.userId === currentUser._id && (
                    <div className="btnTaskGroupVertical">
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
                {expandedTaskIndex === index &&
                  task.completed &&
                  !task.verified &&
                  task.userId === currentUser.partnerId && (
                    <div className="btnTaskGroupVertical">
                      <button
                        className="btnTaskCircle verify"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenVerifyTaskModal();
                        }}
                        aria-label="Verificar tarefa"
                      >
                        <ion-icon
                          name="checkmark-circle"
                          class="icons"
                        ></ion-icon>
                      </button>
                    </div>
                  )}
              </div>
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

      {/* Modais */}
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

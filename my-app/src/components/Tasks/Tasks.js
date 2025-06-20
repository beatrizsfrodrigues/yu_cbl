import React, { useEffect, useState, Suspense, lazy } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, removeRejectMessage } from "../../redux/taskSlice.js";
import { getAuthUser } from "../../utils/storageUtils";
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
  const [expandedTaskIndices, setExpandedTaskIndices] = useState({
    received: null,
    attributed: null,
  });

  const [myTasks, setMyTasks] = useState([]);
  const [partnerTasks, setPartnerTasks] = useState([]);
  const [hasPolled, setHasPolled] = React.useState(false); // Added hasPolled state

  useEffect(() => {
    if (authUser?._id) {
      const fetchTasks = async () => {
        try {
          const myResult = await dispatch(getTasks(authUser._id)).unwrap();
          if (Array.isArray(myResult)) {
            setMyTasks(myResult);
          }
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        }
      };
      fetchTasks();
    }
  }, [authUser?._id, partnerUser?._id, dispatch]);

  useEffect(() => {
    if (authUser?.partnerId) {
      const fetchPartner = async () => {
        try {
          const result = await dispatch(
            fetchPartnerUser(authUser.partnerId)
          ).unwrap();
          setPartnerUser(result || {});
        } catch (err) {
          console.error("Failed to fetch partner user:", err);
        }
      };
      fetchPartner();
    }
  }, [authUser?.partnerId, dispatch]);

  const prevMyTasksRef = React.useRef([]);
  const prevPartnerTasksRef = React.useRef([]);

  useEffect(() => {
    let isMounted = true;
    const POLL_INTERVAL = 5000;
    const pollTasks = async () => {
      try {
        if (authUser?._id) {
          const myResult = await dispatch(getTasks(authUser._id)).unwrap();

          if (
            JSON.stringify(myResult) !== JSON.stringify(prevMyTasksRef.current)
          ) {
            setMyTasks(myResult || []);
            prevMyTasksRef.current = myResult || [];
          }
        }
        if (partnerUser?._id) {
          const partnerResult = await dispatch(
            getTasks(partnerUser._id)
          ).unwrap();
          if (
            JSON.stringify(partnerResult) !==
            JSON.stringify(prevPartnerTasksRef.current)
          ) {
            setPartnerTasks(partnerResult || []);
            prevPartnerTasksRef.current = partnerResult || [];
          }
        }
        if (isMounted && !hasPolled) setHasPolled(true);
      } catch (err) {
        console.error("Failed to poll tasks:", err);
      }
    };
    pollTasks(); // Run once immediately
    const intervalId = setInterval(pollTasks, POLL_INTERVAL);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [
    authUser?._id,
    partnerUser?._id,
    authUser?.partnerId,

    dispatch,
    hasPolled,
  ]);

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

  // Use useMemo to memoize filteredTasks for referential stability
  const filteredTasks = React.useMemo(() => {
    const baseTasks = filter === "received" ? myTasks : partnerTasks;
    console.log("Base tasks:", baseTasks);

    return baseTasks.filter((task) => {
      const matchesCriteria =
        filterCriteria === "todas" ||
        (filterCriteria === "concluidas" && task.completed && task.verified) ||
        (filterCriteria === "porConcluir" &&
          !task.completed &&
          !task.verified) ||
        (filterCriteria === "espera" && task.completed && !task.verified);

      console.log(matchesCriteria, task.title);

      return matchesCriteria;
    });
  }, [filter, filterCriteria, myTasks, partnerTasks]);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  useEffect(() => {
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
  const handleOpenConcludeTaskModal = React.useCallback((task) => {
    setSelectedTask(task);
    setIsConcludeTaskOpen(true);
  }, []);

  const handleCloseConcludeTaskModal = () => {
    setIsConcludeTaskOpen(false);
  };

  //* open and close verify task window
  const handleOpenVerifyTaskModal = React.useCallback((task) => {
    setTaskToVerify(task);
    setShowVerifyTask(false);
    setIsVerifyTaskOpen(true);
  }, []);

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

  const handleToggleTaskExpand = React.useCallback(
    (index) => {
      setExpandedTaskIndices((prev) => ({
        ...prev,
        [filter]: prev[filter] === index ? null : index,
      }));
    },
    [filter]
  );

  // Use React.memo with custom areEqual for TasksList
  const TasksList = React.memo(
    function TasksList({
      currentUser,
      filteredTasks,
      expandedTaskIndex,
      filter,
      tasksStatus,
      tasksError,
      tasks,
      handleToggleTaskExpand,
      handleOpenConcludeTaskModal,
      handleOpenVerifyTaskModal,
      hasPolled,
    }) {
      return (
        <div id="tasks">
          {tasksStatus === "loading" && !hasPolled ? (
            <div>A carregar tarefas…</div>
          ) : tasksStatus === "failed" ? (
            <div>Error: {tasksError}</div>
          ) : !tasks ? (
            <div>A carregar...</div>
          ) : currentUser && filteredTasks.length > 0 ? (
            filteredTasks?.map((task, index) => (
              <div className="taskDivOp" key={task._id}>
                <div className="taskItemContainer">
                  <button
                    className={`task-item ${
                      expandedTaskIndex === index ? "expanded" : ""
                    } assignedTask`}
                    onClick={() => handleToggleTaskExpand(index)}
                  >
                    <p className="taskTitle">{task.title}</p>
                    {expandedTaskIndex === index && (
                      <p className="taskDescription">
                        Descrição:
                        <br />
                        {task.description}
                      </p>
                    )}
                  </button>
                  {expandedTaskIndex === index &&
                    !task.completed &&
                    !task.verified &&
                    task.userId === authUser._id && (
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
                            handleOpenVerifyTaskModal(task);
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
      );
    },
    (prevProps, nextProps) => {
      // Compare filteredTasks by length and _ids for shallow equality
      const prevTasks = prevProps.filteredTasks;
      const nextTasks = nextProps.filteredTasks;
      const tasksEqual =
        prevTasks.length === nextTasks.length &&
        prevTasks.every((t, i) => t._id === nextTasks[i]._id);
      return (
        tasksEqual &&
        prevProps.expandedTaskIndex === nextProps.expandedTaskIndex &&
        prevProps.filter === nextProps.filter &&
        prevProps.tasksStatus === nextProps.tasksStatus &&
        prevProps.tasksError === nextProps.tasksError &&
        prevProps.authUser?._id === nextProps.authUser?._id
      );
    }
  );

  const hasTaskNotification = tasks.some(
    (task) => task.notification === true && task.status === "atribuidas"
  );

  return (
    <div className="mainBody" id="tasksBody">
      <div className="backgroundDiv"></div>

      <div className="topbar">
        <TopBar title="Tarefas">
          <button onClick={openFilter} aria-label="Abrir filtro">
            <ion-icon name="options-outline" class="icons"></ion-icon>
          </button>
        </TopBar>
      </div>

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
          {hasTaskNotification && <span className="badge"></span>}
        </button>
      </div>
      <div id="tasksSpace">
        <TasksList
          currentUser={authUser}
          filteredTasks={filteredTasks}
          expandedTaskIndex={expandedTaskIndices[filter]}
          filter={filter}
          tasksStatus={tasksStatus}
          tasksError={tasksError}
          tasks={tasks}
          handleToggleTaskExpand={handleToggleTaskExpand}
          handleOpenConcludeTaskModal={handleOpenConcludeTaskModal}
          handleOpenVerifyTaskModal={handleOpenVerifyTaskModal}
          hasPolled={hasPolled}
        />
        <button
          aria-label="Botão para adicionar nova tarefa"
          id="newTask"
          className="profile-button"
          onClick={handleOpenNewTaskModal}
        >
          <ion-icon name="add-outline" class="iconswhite"></ion-icon>
        </button>
      </div>
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
      {isNewTaskModalOpen && authUser && (
        <Suspense fallback={<div>Loading nova tarefa...</div>}>
          <NewTask
            onClose={handleCloseNewTaskModal}
            currentUser={authUser}
            onShowPopUpInfo={handleShowPopUpInfo}
          />
        </Suspense>
      )}

      {isConcludeTaskOpen && (
        <Suspense fallback={<div>Loading nova tarefa...</div>}>
          <ConcludeTask
            onClose={handleCloseConcludeTaskModal}
            currentUser={authUser}
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

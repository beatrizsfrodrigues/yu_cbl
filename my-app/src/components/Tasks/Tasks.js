import React, { useEffect, useState, Suspense, lazy } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, removeRejectMessage } from "../../redux/taskSlice.js";
import { getAuthUser } from "../../utils/storageUtils";
import { fetchPartnerUser } from "../../redux/usersSlice.js";
import { notifyTasks } from "../../redux/taskSlice.js";
import TopBar from "../TopBar.js";
import "./tasks.css";
import LoadingScreen from "../LoadingScreen.js";
import _ from "lodash";

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
    assigned: null,
  });

  const [myTasks, setMyTasks] = useState([]);
  const [partnerTasks, setPartnerTasks] = useState([]);
  const [hasPolled, setHasPolled] = React.useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePartner, setCurrentPagePartner] = useState(1);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [hasMoreTasks2, setHasMoreTasks2] = useState(true);

  const limit = 5;

  // This useEffect handles initial fetches and "load more"
  useEffect(() => {
    if (authUser?._id) {
      const fetchMyTasks = async () => {
        // Renamed for clarity
        try {
          const myResult = await dispatch(
            getTasks({
              userId: authUser._id,
              page: currentPage,
              limit,
              filterCriteria,
            })
          ).unwrap();

          if (Array.isArray(myResult.tasks)) {
            setMyTasks((prevTasks) => {
              const existingTasksMap = new Map(
                (Array.isArray(prevTasks) ? prevTasks : []).map((t) => [
                  t._id,
                  t,
                ])
              );

              myResult.tasks.forEach((task) => {
                existingTasksMap.set(task._id, task);
              });

              const newCombinedTasks = Array.from(existingTasksMap.values());

              return newCombinedTasks;
            });
            setHasMoreTasks(myResult.total > currentPage * limit);
          } else {
            console.warn("Unexpected task result for myTasks:", myResult);
            setHasMoreTasks(false);
          }
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
          setHasMoreTasks(false);
        }
      };
      fetchMyTasks();
    }
  }, [authUser?._id, currentPage, dispatch, limit, filterCriteria]);

  // This useEffect handles initial fetches and "load more" for partner tasks
  useEffect(() => {
    if (authUser?.partnerId) {
      const fetchPartnerData = async () => {
        // Renamed for clarity
        try {
          if (!partnerUser) {
            const part = await dispatch(
              fetchPartnerUser(authUser.partnerId)
            ).unwrap();
            if (part) {
              setPartnerUser(part);
            }
          }

          const result = await dispatch(
            getTasks({
              userId: partnerUser?._id || authUser.partnerId,
              page: currentPagePartner,
              limit,
              filterCriteria,
            })
          ).unwrap();

          if (Array.isArray(result?.tasks)) {
            setPartnerTasks((prevTasks) => {
              const existingTasksMap = new Map(
                (Array.isArray(prevTasks) ? prevTasks : []).map((t) => [
                  t._id,
                  t,
                ])
              );

              result.tasks.forEach((task) => {
                existingTasksMap.set(task._id, task);
              });

              const newCombinedTasks = Array.from(existingTasksMap.values());
              return newCombinedTasks;
            });
            setHasMoreTasks2(result.total > currentPagePartner * limit);
          } else {
            console.warn("Unexpected partner task result:", result);
            setHasMoreTasks2(false);
          }
        } catch (err) {
          console.error("Failed to fetch partner user:", err);
        }
      };
      fetchPartnerData();
    }
  }, [
    authUser?.partnerId,
    currentPagePartner,
    dispatch,
    limit,
    filterCriteria,
    partnerUser,
  ]);

  const prevMyTasksRef = React.useRef([]);
  const prevPartnerTasksRef = React.useRef([]);

  useEffect(() => {
    let isMounted = true;
    const POLL_INTERVAL = 5000;

    const pollTasks = async () => {
      try {
        let shouldUpdateMyTasks = false;
        let shouldUpdatePartnerTasks = false;
        let fetchedMyTasks = [];
        let fetchedPartnerTasks = [];

        const areTasksEqual = (taskA, taskB) => {
          return JSON.stringify(taskA) === JSON.stringify(taskB);
        };

        if (authUser?._id) {
          const myResult = await dispatch(
            getTasks({
              userId: authUser._id,
              page: currentPage,
              limit,
              filterCriteria,
            })
          ).unwrap();

          if (myResult && Array.isArray(myResult.tasks)) {
            setMyTasks((prevTasks) => {
              const currentTasksMap = new Map(prevTasks.map((t) => [t._id, t]));
              let hasChanges = false;

              myResult.tasks.forEach((polledTask) => {
                const existingTask = currentTasksMap.get(polledTask._id);
                if (!existingTask || !areTasksEqual(existingTask, polledTask)) {
                  currentTasksMap.set(polledTask._id, polledTask); // Replace task
                  hasChanges = true;
                }
              });

              const newTasksArray = Array.from(currentTasksMap.values());
              if (hasChanges || newTasksArray.length !== prevTasks.length) {
                return newTasksArray;
              }
              return prevTasks; // No actual changes
            });
          }
        }

        if (partnerUser?._id) {
          const partnerResult = await dispatch(
            getTasks({
              userId: partnerUser._id,
              page: currentPagePartner,
              limit,
              filterCriteria,
            })
          ).unwrap();

          if (partnerResult && Array.isArray(partnerResult.tasks)) {
            setPartnerTasks((prevTasks) => {
              const currentTasksMap = new Map(prevTasks.map((t) => [t._id, t]));
              let hasChanges = false;

              partnerResult.tasks.forEach((polledTask) => {
                const existingTask = currentTasksMap.get(polledTask._id);
                if (!existingTask || !areTasksEqual(existingTask, polledTask)) {
                  currentTasksMap.set(polledTask._id, polledTask); // Replace task
                  hasChanges = true;
                }
              });

              const newTasksArray = Array.from(currentTasksMap.values());
              if (hasChanges || newTasksArray.length !== prevTasks.length) {
                return newTasksArray;
              }
              return prevTasks; // No actual changes
            });
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
    dispatch,
    hasPolled,
    currentPagePartner,
    currentPage,
    filterCriteria, // CRITICAL: This was missing previously and affects which tasks are polled
    limit, // CRITICAL: This was missing previously
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
    const taskArray = Array.isArray(baseTasks) ? baseTasks : [];

    return taskArray.filter((task) => {
      const matchesCriteria =
        filterCriteria === "todas" ||
        (filterCriteria === "concluidas" && task.completed && task.verified) ||
        (filterCriteria === "porConcluir" &&
          !task.completed &&
          !task.verified) ||
        (filterCriteria === "espera" && task.completed && !task.verified);

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
  }, [authUser?.partnerId, dispatch, authUser]); // use only stable dependencies

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
    async (index) => {
      setExpandedTaskIndices((prev) => ({
        ...prev,
        [filter]: prev[filter] === index ? null : index,
      }));

      if (filter === "assigned") {
        const task = filteredTasks[index];
        if (task && task.notification === true) {
          try {
            await dispatch(notifyTasks({ id: task._id, notification: false }));
            setPartnerTasks((prev) =>
              prev.map((t, i) =>
                i === index ? { ...t, notification: false } : t
              )
            );
          } catch (err) {
            console.error("Erro ao atualizar notification:", err);
          }
        }
      }
    },
    [filter, partnerTasks, dispatch]
  );

  const handleLoadMore = async () => {
    setCurrentPage((prev) => {
      console.log("Next page:", prev + 1);
      return prev + 1;
    });
  };

  const handleLoadMore2 = async () => {
    setCurrentPagePartner((prev) => {
      console.log("Next page:", prev + 1);
      return prev + 1;
    });
  };

  const handleTaskConcluded = React.useCallback(
    (updatedTask) => {
      if (updatedTask.userId === authUser._id) {
        setMyTasks((prevTasks) => {
          const newTasks = prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          );
          return Array.from(new Map(newTasks.map((t) => [t._id, t])).values());
        });
      } else if (partnerUser && updatedTask.userId === partnerUser._id) {
        setPartnerTasks((prevTasks) => {
          const newTasks = prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          );
          return Array.from(new Map(newTasks.map((t) => [t._id, t])).values());
        });
      }

      // Close the conclude modal after update
      handleCloseConcludeTaskModal();
    },
    [authUser._id, partnerUser]
  );

  const handleTaskVerified = React.useCallback(
    (updatedTask) => {
      if (updatedTask.userId === authUser._id) {
        // It's a task assigned to the current user (myTasks)
        setMyTasks((prevTasks) => {
          // Find the task by ID and replace it with the updated version
          const newTasks = prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          );
          // Ensure no duplicates and return
          return Array.from(new Map(newTasks.map((t) => [t._id, t])).values());
        });
      } else if (
        updatedTask.userId === authUser.partnerId ||
        (partnerUser && updatedTask.userId === partnerUser._id)
      ) {
        // It's a task assigned by the current user to their partner (partnerTasks)
        setPartnerTasks((prevTasks) => {
          const newTasks = prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          );
          return Array.from(new Map(newTasks.map((t) => [t._id, t])).values());
        });
      }
      // Close the verify modal after update
      handleCloseVerifyTaskModal();
      handleShowPopUpInfo("Tarefa verificada com sucesso!");
    },
    [authUser._id, authUser.partnerId, partnerUser]
  ); // Add partnerUser to dependencies
  // ...

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
            <LoadingScreen isOverlay />
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
                    style={{ position: "relative" }}
                  >
                    {/* Badge individual no canto superior direito */}
                    {filter === "assigned" &&
                      task.completed === true &&
                      task.notification === true && (
                        <span className="badge badge-corner"></span>
                      )}
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
        prevProps.currentUser?._id === nextProps.currentUser?._id
      );
    }
  );

  const hasTaskNotification = React.useMemo(
    () =>
      Array.isArray(partnerTasks)
        ? partnerTasks.some(
            (task) => task.completed === true && task.notification === true
          )
        : false,
    [partnerTasks]
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
          style={{ position: "relative" }}
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
        {filter === "received" &&
          hasMoreTasks &&
          myTasks.length >= currentPage * limit && (
            <div className="load-more-container">
              <button className="submitBtn" onClick={() => handleLoadMore()}>
                Carregar mais
              </button>
            </div>
          )}

        {filter === "assigned" &&
          hasMoreTasks2 &&
          partnerTasks.length >= currentPagePartner * limit && (
            <div className="load-more-container">
              <button className="submitBtn" onClick={() => handleLoadMore2()}>
                Carregar mais
              </button>
            </div>
          )}

        {authUser?.partnerId && (
          <button
            aria-label="Botão para adicionar nova tarefa"
            id="newTask"
            className="profile-button"
            onClick={handleOpenNewTaskModal}
          >
            <ion-icon name="add-outline" class="iconswhite"></ion-icon>
          </button>
        )}
      </div>
      {/* Modais */}
      {showVerifyTask && partnerUser && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <VerifyPopUp
            task={taskToVerify}
            partnerUser={partnerUser}
            onClose={() => setShowVerifyTask(false)}
            onVerify={handleOpenVerifyTaskModal}
          />
        </Suspense>
      )}
      {isVerifyTaskOpen && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <VerifyTask
            onClose={handleCloseVerifyTaskModal}
            partnerUser={partnerUser}
            task={taskToVerify}
            onShowPopUpInfo={handleShowPopUpInfo}
            onReject={handleOpenRejectModal}
            // NEW PROP HERE:
            onTaskVerified={handleTaskVerified} // We will define handleTaskVerified next
          />
        </Suspense>
      )}
      {isNewTaskModalOpen && authUser && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <NewTask
            onClose={handleCloseNewTaskModal}
            currentUser={authUser}
            onShowPopUpInfo={handleShowPopUpInfo}
          />
        </Suspense>
      )}

      {isConcludeTaskOpen && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <ConcludeTask
            onClose={handleCloseConcludeTaskModal}
            currentUser={authUser}
            task={selectedTask}
            onShowPopUpInfo={handleShowPopUpInfo}
            // NEW PROP HERE:
            onTaskConcluded={handleTaskConcluded} // Pass the new callback
          />
        </Suspense>
      )}
      {isPopUpInfoOpen && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <PopUpInfo onClose={handleClosePopUpInfo} message={popUpMessage} />
        </Suspense>
      )}
      {isFilterOpen && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
          <Filter
            filterCriteria={filterCriteria}
            onFilterChange={handleTaskFilterChange}
            onClose={() => setIsFilterOpen(false)}
          />
        </Suspense>
      )}
      {isRejectOpen && (
        <Suspense fallback={<LoadingScreen isOverlay />}>
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

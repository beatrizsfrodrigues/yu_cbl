import React, { useEffect, useState, Suspense, lazy } from "react";
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
  const { data: tasks, status: tasksStatus } = useSelector(
    (state) => state.tasks
  );

  const [authUser] = useState(getAuthUser());

  const currentUserId = authUser?._id;

  const currentUser = useSelector((state) => state.user.authUser);
  const partnerUser = useSelector((state) => state.user.partnerUser);

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
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [partnerTasks, setPartnerTasks] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getTasks(authUser._id)).then((action) => {
        const fetchedTasks = action.payload || [];
        setMyTasks(fetchedTasks);
      });
    }
  }, [dispatch, authUser?._id]);

  useEffect(() => {
    const rejectedTask =
      tasks && tasks.length > 0
        ? tasks.find((task) => task.rejectMessage !== "")
        : null;

    if (rejectedTask && rejectedTask.userId === authUser?._id) {
      handleShowPopUpInfo(
        `Tarefa <b>${rejectedTask.title}</b> foi rejeita. Tenta outra vez.`
      );

      dispatch(removeRejectMessage(rejectedTask._id));
    }
  }, [tasks, currentUserId, dispatch]);

  useEffect(() => {
    let baseTasks = filter === "received" ? myTasks : partnerTasks;
    const filtered = applyFiltering(
      baseTasks,
      filter,
      filterCriteria,
      authUser._id,
      partnerUser
    );
    setFilteredTasks(filtered);
  }, [
    filter,
    filterCriteria,
    authUser._id,
    partnerUser,
    myTasks,
    partnerTasks,
  ]);

  const applyFiltering = (tasksList, userFilter, criteria, authId, partner) => {
    const filtered = tasksList.filter((task) => {
      const isReceived = userFilter === "received" && task.userId === authId;
      const isAssigned =
        userFilter === "assigned" && partner?.id && task.userId === partner.id;

      const matchesCriteria =
        criteria === "todas" ||
        (criteria === "concluidas" && task.completed && task.verified) ||
        (criteria === "porConcluir" && !task.completed && !task.verified) ||
        (criteria === "espera" && task.completed && !task.verified);

      return (isReceived || isAssigned) && matchesCriteria;
    });

    return filtered;
  };

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
    setCurrentUser(authUser);

    // ! getPartner
    const partner =
      users && users.length > 0
        ? users.find((u) => u.id === user.partnerId)
        : null;

    if (partner) {
      setPartnerUser(partner);

      const filtered = applyFiltering(
        tasks || [],
        filter,
        filterCriteria,
        authUser._id,
        partner
      );
      setFilteredTasks(filtered);

      const fetchPartnerTasks = async () => {
        try {
          const resultAction = await dispatch(getTasks(partner.id));
          const fetchedPartnerTasks = resultAction.payload || [];
          setPartnerTasks(fetchedPartnerTasks);

          const taskToVerify = fetchedPartnerTasks.find(
            (task) => task.completed && !task.verified && task.notification
          );

          if (taskToVerify) {
            setTaskToVerify(taskToVerify);
            setShowVerifyTask(true);
          } else {
            setShowVerifyTask(false);
          }
        } catch (err) {
          console.error("Failed to fetch partner tasks:", err);
        }
      };

      fetchPartnerTasks();
    }
  }, [users, currentUserId, dispatch]);

  useEffect(() => {
    const POLL_INTERVAL = 10000; // 10 seconds

    const pollTasks = async () => {
      console.log("polling tasks...");

      if (authUser?._id) {
        const myResult = await dispatch(getTasks(authUser._id));
        const fetchedMyTasks = myResult.payload || [];
        setMyTasks(fetchedMyTasks);
      }

      if (partnerUser?.id) {
        const partnerResult = await dispatch(getTasks(partnerUser.id));
        const fetchedPartnerTasks = partnerResult.payload || [];
        setPartnerTasks(fetchedPartnerTasks);

        const taskToVerify = fetchedPartnerTasks.find(
          (task) => task.completed && !task.verified && task.notification
        );

        if (taskToVerify) {
          setTaskToVerify(taskToVerify);
          setShowVerifyTask(true);
        } else {
          setShowVerifyTask(false);
        }
      }
    };

    const intervalId = setInterval(pollTasks, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [authUser?._id, partnerUser?.id, dispatch]);

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
                  task.userId == currentUser.partnerId && (
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

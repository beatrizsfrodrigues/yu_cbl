import React, { useEffect } from "react";
import "../Definicoes/Arquivo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/usersSlice";

function parseCompletionDate(dateString) {
  if (!dateString || dateString.length < 14) return null;

  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  const hour = parseInt(dateString.substring(8, 10), 10);
  const minute = parseInt(dateString.substring(10, 12), 10);
  const second = parseInt(dateString.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
}
const Arquivo = ({ show, onBack }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.data);
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const activeUser = users?.find((user) => user.id === currentUserId);

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  if (!show) return null;

  const completedTasks = activeUser?.tasks.filter((task) => task.completed);

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="info-pessoal-page">
        <div className="window ">
          <div className="header">
            <button className="back-button" onClick={onBack}>
              <ion-icon name="arrow-back-outline" class="icons"></ion-icon>
            </button>
            <h2>Tarefas Concluídas</h2>
          </div>
          <div className="line"></div>
          <div className="settings-section">
            {completedTasks?.length > 0 ? (
              <ul className="task-list">
                {completedTasks.map((task) => (
                  <li key={task.id} className="task-item animated-task">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>
                      <strong>Data de Conclusão: </strong>
                      {new Date(
                        parseCompletionDate(task.completedDate)
                      ).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Não há tarefas concluídas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arquivo;

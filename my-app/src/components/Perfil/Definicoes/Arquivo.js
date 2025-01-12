import React, { useEffect } from "react";
import "../Definicoes/Arquivo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/usersSlice";

const Arquivo = ({ show, onBack }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.data);
  const activeUser = users?.find((user) => user.id === 2); // Obtém o usuário ativo

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  if (!show) return null;

  // Filtra tarefas concluídas do utilizador ativo
  const completedTasks = activeUser?.tasks.filter((task) => task.completed);

  return (
    <div className="modal ">
      <div className="info-pessoal-page">
        <div className="window ">
          <div className="info-header">
            <button className="back-button" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
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
                      {new Date(task.completedDate).toLocaleDateString("pt-PT", {
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

import React, { useEffect, useState } from "react";
import "../Grafico/grafico.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/usersSlice";
import { X } from "react-feather"; // Ícone para fechar

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Grafico = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const [monthlyData, setMonthlyData] = useState(new Array(31).fill(0));
  const [yearlyData, setYearlyData] = useState(new Array(12).fill(0));
  const [hasCompletedTasks, setHasCompletedTasks] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser"))?.id;
  const users = useSelector((state) => state.users.data || []);
  const activeUser = users.find((user) => user.id === currentUserId);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (activeUser && activeUser.tasks) {
      console.log("Tarefas do usuário:", activeUser.tasks); // Debugging

      const completedTasks = activeUser.tasks.filter((task) => task.completed);
      console.log("Tarefas concluídas:", completedTasks);

      if (completedTasks.length === 0) {
        setHasCompletedTasks(false);
        setMonthlyData(new Array(31).fill(0));
        setYearlyData(new Array(12).fill(0));
        return;
      }

      const monthly = new Array(31).fill(0);
      const yearly = new Array(12).fill(0);

  // Função para converter a data no formato "yyyyMMddHHmmss" para um objeto Date válido
      const parseCompletionDate = (dateString) => {
        if (!dateString || dateString.length !== 14) return null;

        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // JavaScript usa meses de 0 a 11
        const day = parseInt(dateString.substring(6, 8), 10);
        const hour = parseInt(dateString.substring(8, 10), 10);
        const minute = parseInt(dateString.substring(10, 12), 10);
        const second = parseInt(dateString.substring(12, 14), 10);

        return new Date(year, month, day, hour, minute, second);
      };

      completedTasks.forEach((task) => {
        let completionDate = parseCompletionDate(task.completedDate);

        if (!completionDate || isNaN(completionDate.getTime())) {
          console.error("Data inválida encontrada:", task.completedDate);
          return;
        }

        const month = completionDate.getMonth();
        const day = completionDate.getDate();

        if (day >= 1 && day <= 31) {
          monthly[day - 1] += 1;
        }
        if (month >= 0 && month <= 11) {
          yearly[month] += 1;
        }
      });


      setHasCompletedTasks(true);
      setMonthlyData([...monthly]);
      setYearlyData([...yearly]);
      console.log("Dados processados - Mensal:", monthly);
      console.log("Dados processados - Anual:", yearly);
    }
  }, [activeUser]);

  if (!show) return null;

  return (
    <div className="modal">
      <div className="window">
        <div className="grafico-header">
          <h3>Estatísticas</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>

        <div className="grafico-content">
          {hasCompletedTasks ? (
            <>
              <div className="grafico-section">
                <h3>Evolução Diária</h3>
                <div className="grafico-chart">
                  <Line
                    data={{
                      labels: Array.from({ length: 31 }, (_, i) => i + 1),
                      datasets: [
                        {
                          label: "Tarefas Concluídas (Diário)",
                          data: monthlyData,
                          borderColor: "rgba(75, 192, 192, 1)",
                          backgroundColor: "rgba(75, 192, 192, 0.2)",
                        },
                      ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className="grafico-section">
                <h3>Evolução Mensal</h3>
                <div className="grafico-chart">
                  <Bar
                    data={{
                      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                      datasets: [
                        {
                          label: "Tarefas Concluídas (Mensal)",
                          data: yearlyData,
                          backgroundColor: "rgba(153, 102, 255, 0.6)",
                          borderColor: "rgba(153, 102, 255, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>


              
            </>
          ) : (
            <div className="no-tasks-message">
              <p>Ainda não existem tarefas concluídas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grafico;

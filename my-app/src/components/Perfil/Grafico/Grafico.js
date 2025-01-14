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

function parseCompletionDate(dateString) {
  // Exemplo: "20250104003058" => 2025-01-04 00:30:58
  if (!dateString || dateString.length < 14) return null;

  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Em JS, Janeiro = 0
  const day = parseInt(dateString.substring(6, 8), 10);
  const hour = parseInt(dateString.substring(8, 10), 10);
  const minute = parseInt(dateString.substring(10, 12), 10);
  const second = parseInt(dateString.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
}

const Grafico = ({ show, onClose }) => {
  const dispatch = useDispatch();

  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [hasCompletedTasks, setHasCompletedTasks] = useState(true);

  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const users = useSelector((state) => state.users.data);
  const activeUser = useSelector((state) =>
    state.users.data?.find((user) => user.id === currentUserId)
  );

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (activeUser) {
      console.log("Active user tasks:", activeUser.tasks);

      const completedTasks = activeUser.tasks.filter((task) => task.completed);

      if (completedTasks.length === 0) {
        setHasCompletedTasks(false);
        setMonthlyData([]);
        setYearlyData([]);
        return;
      } else {
        setHasCompletedTasks(true);
      }

      const monthly = Array(31).fill(0);
      const yearly = Array(12).fill(0);

      completedTasks.forEach((task) => {
        // Aqui usamos a função parseCompletionDate
        const completionDate = parseCompletionDate(task.completedDate);
        if (!completionDate) return; // Se por acaso vier inválido, ignora

        const month = completionDate.getMonth();  // 0 a 11
        const day = completionDate.getDate();     // 1 a 31

        if (!isNaN(day) && day > 0 && day <= 31) {
          monthly[day - 1] += 1;
        }
        if (!isNaN(month) && month >= 0 && month <= 11) {
          yearly[month] += 1;
        }
      });

      setMonthlyData(monthly);
      setYearlyData(yearly);
    }
  }, [activeUser]);

  if (!show) return null;

  const monthlyChartData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Tarefas Concluídas (Mensal)",
        data: monthlyData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const yearlyChartData = {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    datasets: [
      {
        label: "Tarefas Concluídas (Anual)",
        data: yearlyData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grafico-modal">
      <div className="grafico-header">
        <h2>Gráfico</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
      <hr />
      {activeUser && hasCompletedTasks ? (
        <>
          <div className="grafico-section">
            <h3>Evolução Mensal</h3>
            <Line data={monthlyChartData} />
          </div>
          <div className="grafico-section">
            <h3>Evolução Anual</h3>
            <Bar data={yearlyChartData} />
          </div>
        </>
      ) : (
        <div className="no-tasks-message">
          <p>Ainda não existem tarefas conclúidas!</p>
        </div>
      )}
    </div>
  );
};

export default Grafico;

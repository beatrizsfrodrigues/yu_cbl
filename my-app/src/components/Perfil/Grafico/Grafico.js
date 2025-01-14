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

const Grafico = ({ show, onClose }) => {
  const dispatch = useDispatch();

  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [hasCompletedTasks, setHasCompletedTasks] = useState(true); 

  const users = useSelector((state) => state.users.data);
  const activeUser = useSelector((state) =>
    state.users.data?.find((user) => user.id === 2)
  );

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (activeUser) {
      console.log("Active user tasks:", activeUser.tasks); // Verifique se as tarefas estão sendo carregadas corretamente
  
      const completedTasks = activeUser.tasks.filter((task) => task.completed);
  
      if (completedTasks.length === 0) {
        setHasCompletedTasks(false); // Não há tarefas concluídas
        setMonthlyData([]);
        setYearlyData([]);
        return;
      } else {
        setHasCompletedTasks(true); // Existem tarefas concluídas
      }
  
      const monthly = Array(31).fill(0);
      const yearly = Array(12).fill(0);
  
      completedTasks.forEach((task) => {
        const completionDate = new Date(task.completedDate);
        const month = completionDate.getMonth();
        const day = completionDate.getDate();
  
        if (!isNaN(day) && day > 0 && day <= 31) monthly[day - 1] += 1;
        if (!isNaN(month) && month >= 0 && month <= 11) yearly[month] += 1;
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

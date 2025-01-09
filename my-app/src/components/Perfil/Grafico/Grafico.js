import React, { useEffect, useState } from "react";
import "../Grafico/grafico.css";
import {
  Line,
  Bar,
} from "react-chartjs-2";
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
import {  fetchUsers } from "../../../redux/usersSlice"; 

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

  const users = useSelector((state) => state.users.data);
  const activeUser = useSelector((state) =>
    state.users.data?.find((user) => user.ativo === 1)
  );

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (activeUser) {
      // Filtra tarefas concluídas
      const completedTasks = activeUser.tasks.filter((task) => task.completed);

      // Dados mensais e anuais
      const monthly = Array(31).fill(0);
      const yearly = Array(12).fill(0);

      completedTasks.forEach((task) => {
        const completionDate = new Date(task.completedDate); // completedDate deve ser uma string válida
        const month = completionDate.getMonth(); // 0-11
        const day = completionDate.getDate(); // 1-31

        if (!isNaN(day) && day > 0 && day <= 31) monthly[day - 1] += 1; // Incrementa o dia correspondente
        if (!isNaN(month) && month >= 0 && month <= 11) yearly[month] += 1; // Incrementa o mês correspondente
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
      <div className="grafico-section">
        <h3>Evolução Mensal</h3>
        <Line data={monthlyChartData} />
      </div>
      <div className="grafico-section">
        <h3>Evolução Anual</h3>
        <Bar data={yearlyChartData} />
      </div>
    </div>
  );
};

export default Grafico;

import React from "react";
import "../Grafico/grafico.css";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";


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

const Grafico = ({ show, onClose, monthlyData = [], yearlyData = [] }) => {
    if (!show) return null;
  
    // Dados fictícios caso os arrays estejam vazios
    const validMonthlyData = monthlyData.length ? monthlyData : Array(31).fill(0);
    const validYearlyData = yearlyData.length ? yearlyData : Array(12).fill(0);
  
    // Configurações dos gráficos
    const monthlyChartData = {
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      datasets: [
        {
          label: "Tarefas Concluídas",
          data: validMonthlyData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };
  
    const yearlyChartData = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      datasets: [
        {
          label: "Tarefas Concluídas",
          data: validYearlyData,
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

 
 


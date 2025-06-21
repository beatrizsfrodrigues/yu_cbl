// src/components/Grafico/Grafico.js

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
import { useSelector } from "react-redux";

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
  // todas as tarefas vêm do slice tasks
  const tasks = useSelector((state) => state.tasks.data || []);
  // utilizador atual do slice user
  const currentUser = useSelector((state) => state.user.authUser);

  const [monthlyData, setMonthlyData] = useState(new Array(31).fill(0));
  const [yearlyData, setYearlyData]   = useState(new Array(12).fill(0));
  const [hasCompletedTasks, setHasCompletedTasks] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) return;

    // filtrar só as tarefas concluídas deste utilizador
    const completedTasks = tasks.filter(
      (t) => t.userId === currentUser._id && t.completed
    );

    if (completedTasks.length === 0) {
      setHasCompletedTasks(false);
      setMonthlyData(new Array(31).fill(0));
      setYearlyData(new Array(12).fill(0));
      return;
    }

    const monthly = new Array(31).fill(0);
    const yearly  = new Array(12).fill(0);

    const parseDate = (ds) => {
      if (!ds || ds.length !== 14) return null;
      const y  = +ds.slice(0,4),
            mo = +ds.slice(4,6)-1,
            d  = +ds.slice(6,8),
            h  = +ds.slice(8,10),
            mi = +ds.slice(10,12),
            s  = +ds.slice(12,14);
      return new Date(y, mo, d, h, mi, s);
    };

    completedTasks.forEach((task) => {
      const dt = parseDate(task.completedDate);
      if (!dt || isNaN(dt)) return;
      monthly[dt.getDate() - 1] += 1;
      yearly[dt.getMonth()]     += 1;
    });

    setHasCompletedTasks(true);
    setMonthlyData(monthly);
    setYearlyData(yearly);
  }, [tasks, currentUser]);

  if (!show) return null;

  return (
    // Backdrop: fecha o modal ao clicar fora da window
    <div className="modal" onClick={onClose}>
      {/* Window: impede que cliques interiores fechem o modal */}
      <div className="window" onClick={e => e.stopPropagation()}>
        <div className="grafico-header">
          <h3>Estatísticas</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            className="icons"
            style={{ fontSize: "28px" }}
          />
        </div>
        <div className="line" />

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
                      labels: [
                        "Jan","Fev","Mar","Abr","Mai","Jun",
                        "Jul","Ago","Set","Out","Nov","Dez",
                      ],
                      datasets: [
                        {
                          label: "Tarefas Concluídas (Mensal)",
                          data: yearlyData,
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

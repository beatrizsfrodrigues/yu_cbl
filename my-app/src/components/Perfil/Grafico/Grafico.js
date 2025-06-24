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
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { getTasks } from "../../../redux/taskSlice.js";

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

  // utilizador atual do slice user
  const currentUser = useSelector((state) => state.user.authUser);

  // todas as tarefas vêm agora directamente do slice tasks
  const tasks = useSelector((state) => state.tasks.data || [], shallowEqual);

  const [monthlyData, setMonthlyData] = useState(new Array(31).fill(0));
  const [yearlyData, setYearlyData] = useState(new Array(12).fill(0));
  const [hasCompletedTasks, setHasCompletedTasks] = useState(false);

  /* ────────────────────────────────────────────────────────────────
   * 1) Sempre que o modal abre faz fetch das tarefas concluídas
   * ────────────────────────────────────────────────────────────────*/
  useEffect(() => {
    if (!show || !currentUser?._id) return;

    dispatch(
      getTasks({
        userId: currentUser._id,
        page: 1,
        limit: 1000, // chega para um ano inteiro de histórico
        filterCriteria: "concluidas",
      })
    );
  }, [show, currentUser?._id, dispatch]);

  /* ────────────────────────────────────────────────────────────────
   * 2) Calcula os dados do gráfico sempre que tasks ou user mudam
   * ────────────────────────────────────────────────────────────────*/
  useEffect(() => {
    if (!currentUser?._id) return;

    // filtrar só as tarefas concluídas deste utilizador
    const completedTasks = tasks.filter(
      (t) => t.userId === currentUser._id && t.completed === true
    );

    // debug – vê no console quantas encontrou
    console.log("[Grafico] tarefas concluídas encontradas:", completedTasks);

    if (completedTasks.length === 0) {
      setHasCompletedTasks(false);
      setMonthlyData(new Array(31).fill(0));
      setYearlyData(new Array(12).fill(0));
      return;
    }

    const monthly = new Array(31).fill(0);
    const yearly = new Array(12).fill(0);

    const parseDate = (ds) => {
      if (ds === undefined || ds === null) return null;
      ds = String(ds);
      if (ds.length !== 14) return null;
      const y = +ds.slice(0, 4),
        mo = +ds.slice(4, 6) - 1,
        d = +ds.slice(6, 8),
        h = +ds.slice(8, 10),
        mi = +ds.slice(10, 12),
        s = +ds.slice(12, 14);
      return new Date(y, mo, d, h, mi, s);
    };

    completedTasks.forEach((task) => {
      const dt = parseDate(task.completedDate);
      if (!dt || isNaN(dt)) return;
      monthly[dt.getDate() - 1] += 1;
      yearly[dt.getMonth()] += 1;
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
      <div className="window" onClick={(e) => e.stopPropagation()}>
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
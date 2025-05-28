import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import axios from "axios";
import { getAuthToken } from "./utils/cookieUtils";
import store from "./redux//store";
import { Provider } from "react-redux";

import NavBar from "./components/NavBar";
import Tasks from "./components/Tasks/Tasks";
import Home from "./components/Home/Home";
import Closet from "./components/Home/Closet";
import Store from "./components/Home/Store";
import Login from "./components/Login";
import Register from "./components/Register";
import Messages from "./components/Tasks/Messages";

import Profile from "./components/Perfil/Perfil/Profile";
import Informacoes from "./components/Perfil/Informacoes/Informacoes";
import InfoPessoal from "./components/Perfil/Definicoes/InfoPessoal";
import Definicoes from "./components/Perfil/Definicoes/Definicoes";
import Grafico from "./components/Perfil/Grafico/Grafico";
import Arquivo from "./components/Perfil/Definicoes/Arquivo";

import Welcome from "./components/Welcome/Welcome";
import Connection from "./components/Welcome/Connection";
import Apresentacao from "./components/Welcome/Apresentacao";

import Questions from "./components/Welcome/Questions";

import "./App.css";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const lastTime = localStorage.getItem("lastQuestionTime");
    if (lastTime) {
      const now = Date.now();
      const diffInMilliseconds = now - Number(lastTime);
      const diffInSeconds = diffInMilliseconds / 1000;

      if (diffInSeconds >= 2592000) {
        // 30 dias em segundos
        console.log("Novo questionário disponível.");
      }
    }
  }, [location.pathname]);

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  // Nomes das páginas (mudar à vontade)
  const pageTitles = {
    "/": "Início - YU",
    "/home": "Home - YU",
    "/closet": "Closet - YU",
    "/store": "Store - YU",
    "/tasks": "Tarefas - YU",
    "/profile": "Perfil - YU",
    "/login": "Login - YU",
    "/register": "Registo - YU",
    "/connection": "Ligação - YU",
    "/questions": "Questionário - YU",
    "/informacoes": "Informações - YU",
    "/infoPessoal": "Dados pessoais - YU",
    "/definicoes": "Definições - YU",
    "/grafico": "Estatísticas - YU",
    "/arquivo": "Arquivo - YU",
    "/apresentacao": "Apresentação - YU",
    "/messages": "Mensagens - YU",
  };

  useEffect(() => {
    document.title = pageTitles[location.pathname] || "YU";
  }, [location.pathname]);

  /* Só mostra a NavBar se a rota atual estiver em showNavRoutes , se quiserem adicionar
  outra pagina, basta meter o /nome no showNavRoutes como fiz no home, task e profile */

  const showNavRoutes = ["/home", "/tasks", "/messages", "/profile"];
  const shouldShowNav = showNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <NavBar />}
      <div className="route-container">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/store" element={<Store />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/connection" element={<Connection />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/informacoes" element={<Informacoes />} />
          <Route path="/infoPessoal" element={<InfoPessoal />} />
          <Route path="/definicoes" element={<Definicoes />} />
          <Route path="/grafico" element={<Grafico />} />
          <Route path="/arquivo" element={<Arquivo />} />
          <Route path="/apresentacao" element={<Apresentacao />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";

import store       from "./redux/store";
import NavBar      from "./components/NavBar";
import Welcome     from "./components/Welcome/Welcome";
import Connection  from "./components/Welcome/Connection";
import Questions   from "./components/Welcome/Questions";
import Apresentacao from "./components/Welcome/Apresentacao";

import Login       from "./components/Login";
import Register    from "./components/Register";

import Home        from "./components/Home/Home";
import Closet      from "./components/Home/Closet";
import Store       from "./components/Home/Store";

import Tasks       from "./components/Tasks/Tasks";
import Messages    from "./components/Tasks/Messages";

import Profile     from "./components/Perfil/Perfil/Profile";
import Informacoes from "./components/Perfil/Informacoes/Informacoes";
import InfoPessoal from "./components/Perfil/Definicoes/InfoPessoal";
import Definicoes  from "./components/Perfil/Definicoes/Definicoes";
import Grafico     from "./components/Perfil/Grafico/Grafico";
import Arquivo     from "./components/Perfil/Definicoes/Arquivo";

import Termos      from "./components/Perfil/Definicoes/Termos";

import "./App.css";

const pageTitles = {
  "/":            "Início - YU",
  "/home":        "Home - YU",
  "/closet":      "Closet - YU",
  "/store":       "Store - YU",
  "/tasks":       "Tarefas - YU",
  "/messages":    "Mensagens - YU",
  "/profile":     "Perfil - YU",
  "/informacoes": "Informações - YU",
  "/infoPessoal": "Dados pessoais - YU",
  "/definicoes":  "Definições - YU",
  "/grafico":     "Estatísticas - YU",
  "/arquivo":     "Arquivo - YU",
  "/sobre":       "Sobre - YU",
  "/login":       "Login - YU",
  "/register":    "Registo - YU",
  "/connection":  "Ligação - YU",
  "/questions":   "Questionário - YU",
  "/apresentacao":"Apresentação - YU",
};

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    document.title = pageTitles[location.pathname] || "YU";
  }, [location.pathname]);

  axios.defaults.withCredentials = true;

  const showNav = ["/home", "/tasks", "/messages", "/profile"].includes(location.pathname);

  return (
    <>
      {showNav && <NavBar />}
      <div className="route-container">
        <Routes>
          <Route path="/"            element={<Welcome />} />
          <Route path="/connection"  element={<Connection />} />
          <Route path="/questions"   element={<Questions />} />
          <Route path="/apresentacao"element={<Apresentacao />} />

          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />

          <Route path="/home"        element={<Home />} />
          <Route path="/closet"      element={<Closet />} />
          <Route path="/store"       element={<Store />} />

          <Route path="/tasks"       element={<Tasks />} />
          <Route path="/messages"    element={<Messages />} />

          <Route path="/profile"     element={<Profile />} />
          <Route path="/informacoes" element={<Informacoes />} />
          <Route path="/infoPessoal" element={<InfoPessoal />} />
          <Route path="/definicoes"  element={<Definicoes />} />
          <Route path="/grafico"     element={<Grafico />} />
          <Route path="/arquivo"     element={<Arquivo />} />

          <Route path="/sobre"      element={<Termos />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

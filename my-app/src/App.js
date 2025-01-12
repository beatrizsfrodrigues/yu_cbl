import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Tasks from "./components/Tasks/Tasks";
import Home from "./components/Home/Home";
import Closet from './components/Home/Closet';
import Store from './components/Home/Store';
import Login from "./components/Login";
import Register from "./components/Register";
 
 
import Profile from "./components/Perfil/Perfil/Profile";
import Informacoes from "./components/Perfil/Informacoes/Informacoes";
import InfoPessoal from "./components/Perfil/Definicoes/InfoPessoal";
import Definicoes from "./components/Perfil/Definicoes/Definicoes";
import Grafico from "./components/Perfil/Grafico/Grafico";
import Arquivo from "./components/Perfil/Definicoes/Arquivo";

import Welcome from "./components/Welcome/Welcome";
import Connection from "./components/Welcome/Connection";
 
import Questions from "./components/Welcome/Questions";
 
import "./App.css";

function AppContent() {
  const location = useLocation();
  /* Só mostra a NavBar se a rota atual estiver em showNavRoutes , se quiserem adicionar
  outra pagina, basta meter o /nome no showNavRoutes como fiz no home, task e profile */
  const showNavRoutes = ["/home", "/tasks", "/profile"];
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
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

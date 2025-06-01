import React, { useEffect, useCallback } from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/YU_logo/YU.webp";

const API_URL = process.env.REACT_APP_API_URL;

const Welcome = () => {
  const navigate = useNavigate();

  // Verifica se o usuário está logado e redireciona para a Home
  useEffect(() => {
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((res) => {
        //console.log("Resposta do /api/me:", res.status); // <-- Adicionado para debug
        if (res.ok) {
          console.log("Utilizador autenticado, a redirecionar para /home");
          navigate("/home");
        } else {
          //console.log("Utilizador NÃO autenticado, permanece na Welcome");
        }
      })
      .catch((err) => {
        console.log("Erro ao verificar autenticação:", err);
      });
  }, [navigate]);

  const handleClickRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleClickLogin = useCallback(() => {
    console.log("Login button clicked");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="Welcome mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <img className="logo" src={logo} alt="YU Logo" width="300" />
      <div className="text-container">
        <header className="title">Bem vindo à YU!</header>
        <div className="title-desc">
          Vamos iniciar esta jornada para <br></br> conquistares os teus
          objetivos.
        </div>
        <button
          type="submit"
          className="start-button"
          onClick={handleClickRegister}
        >
          Registar
        </button>
        <button
          type="submit"
          className="start-button-light"
          onClick={handleClickLogin}
        >
          Iniciar Sessão
        </button>
      </div>
    </div>
  );
};

export default Welcome;

import React, { useEffect, useCallback } from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/YU_logo/YU.webp";

const Welcome = () => {
  const navigate = useNavigate();

  // Verifica se o usuário está logado e redireciona para a Home
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.id) {
      navigate("/home"); // Redireciona para a página Home
    }
  }, [navigate]);

  const handleClickRegister = useCallback(() => {
    console.log("Register button clicked");
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

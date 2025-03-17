import React from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/YU_logo/YU.svg";

const Welcome = () => {
  const navigate = useNavigate();

  const handleClickRegister = () => {
    console.log("Button clicked");
    navigate("/register");
  };

  const handleClickLogin = () => {
    console.log("Button clicked");
    navigate("/login");
  };

  return (
    <div className="Welcome mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <img className="logo" src={logo} alt="YU Logo" width="300" />
      <div className="text-container">
        <div className="title">Bem vindo à YU!</div>
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

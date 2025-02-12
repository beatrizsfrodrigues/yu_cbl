import React from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/YU_logo/YU_boneca_a_frente.svg";

const Welcome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Button clicked");
    navigate("/register");
  };

  return (
    <div className="Welcome">
      <div className="backgroundDiv backgroundDiv2"></div>
      <img className="logo" src={logo} alt="YU Logo" width="300" />
      <div className="text-container">
        <div className="title">Bem vindo à YU!</div>
        <div className="title-desc">
          Vamos iniciar esta jornada para <br></br> conquistares os teus
          objetivos.
        </div>
        <button type="submit" className="start-button" onClick={handleClick}>
          Começar
        </button>
      </div>
    </div>
  );
};

export default Welcome;

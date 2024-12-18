import React from "react";
import "../assets/css/welcome.css";
import logo from "../assets/imgs/YU_logo/YU-02.svg";

const Welcome = () => {
  return (
    <div className="Welcome">
      <img src={logo} alt="YU Logo" width="300" />
      <div className="text-container">
        <div className="title">Bem vindo à YU!</div>
        <div>
          Vamos iniciar esta jornada para <br></br> conquistares os teus
          objetivos.
        </div>
      </div>
      <a href="#">
        <div className="start-button">Começar</div>
      </a>
    </div>
  );
};

export default Welcome;

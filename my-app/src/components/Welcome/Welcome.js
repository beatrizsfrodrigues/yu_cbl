import React from "react";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/YU_logo/YU-02.svg";

const Welcome = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Button clicked");
    navigate("/register");
  };

  return (
    <div className="Welcome">
      <img className="logo" src={logo} alt="YU Logo" width="300" />
      <div className="text-container">
        <div className="title">Bem vindo à YU!</div>
        <div>
          Vamos iniciar esta jornada para <br></br> conquistares os teus
          objetivos.
        </div>
        <button type="submit" className="start-button" onClick={handleClick}>Começar</button>
      </div>
    </div>
  );
};

export default Welcome;

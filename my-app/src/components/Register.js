import React, { useState } from "react";
import "../assets/css/Register.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";
import bolas from "../assets/imgs/YU_bolas/Group 97.svg";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("Username", username);
    localStorage.setItem("Email", email);
    localStorage.setItem("Password", password);
    setMessage("Registo efetuado com sucesso!");
  };

  const isFormComplete = email.trim() !== "" && password.trim() !== "";

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className= "form-container">
            <div className="logo-container">
              <img src={logo} alt="logo" className="logo" />
              <img src={bolas} alt="bolas" className="bolas" />
            </div>
            <div className="label-container">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
        <div className="user-container">
          <label>Nome de Utilizador</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="pass-container">
          <label>Palavra-passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        </div>

        <div className="register-link">
          <p>Já tens conta? <a href="/Login">Login</a> </p>
        </div>

        <button
          href="/Login"
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} // Disable button if form is incomplete
        >Registar</button>
        {message && <p>{message}</p>}

      </form>
    </div>
  );
};

export default Register;

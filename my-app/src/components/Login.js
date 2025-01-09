import React, { useState } from "react";
import "../assets/css/Login.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";
//import bolas from "../assets/imgs/YU_bolas/Group 97.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
  

  if (storedEmail === email){
    if(storedPassword === password){
      setMessage("Login efetuado com sucesso!");
    } else {
      setMessage("Palavra-passe incorreta.");
    }
  } else {
    setMessage("Utilizador não encontrado.")
  }
};  

  const isFormComplete = email.trim() !== "" && password.trim() !== "";
  //console.log("Form Complete:", isFormComplete);

  return (
    <div>
      {/* <h1>Login</h1> */}
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          
          <div className="logo-container">
           <img src={logo} alt="logo" className="logo" />
           {/*<img src={bolas} alt="bolas" className="bolas" />*/}
          </div>

          <div className="label-container">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          </div>

        <div className="pass-container">
          <label>Palavra-passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="register-link">
          <p>Ainda não tens conta? <a href="/register">Registar</a> </p>
        </div>

        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} // Disable button if form is incomplete
        > Login </button>
        {message && <p>{message}</p>}
       
       </div>
      </form>
      </div>
  );
};

export default Login;

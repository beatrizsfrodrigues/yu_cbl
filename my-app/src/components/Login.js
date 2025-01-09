import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../assets/css/Login.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";
// import bolas from "../assets/imgs/YU_bolas/Group 97.svg";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === emailOrUsername || user.username === emailOrUsername);

    if (user) {
      if (user.password === password) {
        setMessage("Login efetuado com sucesso!");
        localStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, code: user.code, username: user.username }));
        setAlert('');
        navigate('/');
      } else {
        setAlert("Palavra-passe incorreta.");
      }
    } else {
      setAlert("Utilizador não encontrado.");
    }
  };

  const isFormComplete = emailOrUsername.trim() !== "" && password.trim() !== "";

  return (
    <div>
      {/* <h1>Login</h1> */}
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          
          <div className="logo-container">
           <img src={logo} alt="logo" className="logo" />
           {/*<img src={bolas} alt="bolas" className="bolas" />*/}
          </div>
          {alert && <p className="alert">{alert}</p>}
          <div className="label-container">
            <label>Email / Utilizador</label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
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
          <p>Ainda não tens conta? <a href="/Register">Registar</a></p>
        </div>
        {message && <p>{message}</p>}
        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} // Disable button if form is incomplete
        >Login</button>
      </form>
    </div>
  );
};

export default Login;
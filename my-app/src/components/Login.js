import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Login.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    //Encontra utilizadores registados com o email ou username
    const user = users.find(
      (user) =>
        user.email === emailOrUsername || user.username === emailOrUsername
    );

    if (user) {
      if (user.password === password) {
        // Se encontrar o utilizador inserido e caso a password inserida seja igual à registada, avança o login com sucesso
        setMessage("Login efetuado com sucesso!");
        localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id }));
        setAlert("");
        navigate("/questions");
      } else {
        setAlert("Palavra-passe incorreta.");
      }
    } else {
      setAlert("Utilizador não encontrado.");
    }
  };

  //Apenas deixa avançar com o login quando os campos de email/username e password forem preenchidos
  const isFormComplete =
    emailOrUsername.trim() !== "" && password.trim() !== "";

  return (
    <div className="mainBody">
      {/* <h1>Login</h1> */}
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          {alert && <p className="alert">{alert}</p>}
          <div className="label-container">
            <label>Email / Utilizador</label>
            <input
              type="text"
              placeholder="Email / Nome de Utilizador..."
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>
          <div className="pass-container">
            <label>Palavra-passe</label>
            <input
              type="password"
              placeholder="Inserir password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="register-link">
          <p>
            Ainda não tens conta? <a href="/Register">Registar</a>
          </p>
        </div>
        {message && <p>{message}</p>}
        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} //O botão está inativo enquanto o formulário não é preenchido
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

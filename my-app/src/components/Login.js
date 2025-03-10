import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../redux/usersSlice";
import { fetchMascot } from "../redux/mascotSlice";
import "../assets/css/Login.css";
import logo from "../assets/imgs/YU_logo/YU.svg";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const usersStatus = useSelector((state) => state.users.status);
  const mascotStatus = useSelector((state) => state.mascot.status);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
    if (mascotStatus === "idle") {
      dispatch(fetchMascot());
    }
  }, [usersStatus, mascotStatus, dispatch]);

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
        localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id })); //Guarda o id do utilizador que fez login
        setAlert("");
        navigate("/home");
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
      <div className="backgroundDiv backgroundDiv2"></div>
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
              className="input"
              placeholder="Email / Nome de Utilizador..."
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>
          <div className="pass-container">
            <label>Palavra-passe</label>
            <input
              type="password"
              className="input"
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
          Iniciar Sessão
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../redux/usersSlice";
import { fetchMascot } from "../redux/mascotSlice";
import "../assets/css/Login.css";
import logo from "../assets/imgs/YU_logo/YU.webp";
import visibleIcon from "../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../assets/imgs/Icons/notvisible.png";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Controla a visibilidade da palavra-passe
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

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = logo;
    document.head.appendChild(link);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Encontra utilizadores registados com o email ou username
    const user = users.find(
      (user) =>
        user.email === emailOrUsername || user.username === emailOrUsername
    );

    if (user) {
      if (user.password === password) {
        // Se encontrar o utilizador inserido e caso a password inserida seja igual à registada, avança o login com sucesso
        setMessage("Login efetuado com sucesso!");
        localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id })); // Guarda o id do utilizador que fez login
        setAlert("");
        navigate("/home");
      } else {
        setAlert("Palavra-passe incorreta.");
      }
    } else {
      setAlert("Utilizador não encontrado.");
    }
  };

  // Apenas deixa avançar com o login quando os campos de email/username e password forem preenchidos
  const isFormComplete =
    emailOrUsername.trim() !== "" && password.trim() !== "";

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img
              src={logo}
              alt="logo"
              className="logo"
              width="277"
              height="191"
              fetchPriority="high"
            />
          </div>
          <header>
            <h1>Login</h1>
          </header>
          {alert && <p className="alert">{alert}</p>}
          <div className="label-container">
            <label for="input-email-utilizador">Email / Utilizador</label>
            <input
              required
              id="input-email-utilizador"
              type="text"
              className="input"
              placeholder="Email / Nome de Utilizador..."
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>
          <div className="pass-container">
            <label for="input-password">Palavra-passe</label>
            <div className="password-input-container">
              <input
                required
                id="input-password"
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Inserir palavra-passe..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? notVisibleIcon : visibleIcon}
                  alt="Mostrar palavra-passe"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="register-link">
          <p>
            Ainda não tens conta? <a href="/Register">Registar</a>
          </p>
        </div>
        {message && <p>{message}</p>}
        <button className="buttonBig" type="submit">
          Iniciar Sessão
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Login.css";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/imgs/YU_logo/YU.webp";

import { setAuthToken, setAuthUser } from "../utils/storageUtils";
import { googleLogin } from "../redux/usersSlice.js";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const { status, error, authUser } = useSelector((state) => state.user);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = logo;
    document.head.appendChild(link);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          emailOrUsername,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, user } = response.data;

      if (token && user) {
        setAuthToken(token);
        setAuthUser(user);

        if (user.role === "admin") {
          window.location.href = `https://yu-admin-five.vercel.app/dashboard?token=${token}`;
        } else {
          navigate("/home");
        }
      } else {
        setAlert("Resposta inesperada da API.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAlert(error.response.data.message);
      } else {
        setAlert("Erro ao fazer login.");
      }
    }
  };

  const googleButton = useRef(null);

  useEffect(() => {
    if (window.google && googleButton.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButton.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setAlert("");

    try {
      const resultAction = await dispatch(googleLogin(response)).unwrap();

      const { user, isNewUser } = resultAction;
      console.log(resultAction);
      console.log("newUser", isNewUser);
      console.log("newUser", user);
      if (user) {
        if (isNewUser) {
          navigate("/questions");
        } else {
          navigate("/home");
        }
      } else {
        setAlert("Resposta inesperada da API após login com Google.");
      }
    } catch (err) {
      // This part executes if googleLogin.rejected
      console.error("Erro ao fazer login com Google (componente):", err);
      setAlert(err || "Erro ao fazer login com Google.");
    }
  };

  const isFormComplete =
    emailOrUsername.trim() !== "" && password.trim() !== "";

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img
              rel="preload"
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
            <label htmlFor="input-email-utilizador">Email / Utilizador</label>
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
            <label htmlFor="input-password">Palavra-passe</label>
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
                aria-label={
                  showPassword
                    ? "Esconder palavra-passe"
                    : "Mostrar palavra-passe"
                }
              >
                <ion-icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  className="icons"
                ></ion-icon>
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
        <button className="buttonBig" type="submit" disabled={!isFormComplete}>
          Iniciar Sessão
        </button>
        <div className="buttonGoogle" ref={googleButton}></div>
      </form>
    </div>
  );
};

export default Login;

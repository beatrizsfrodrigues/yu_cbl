// src/components/Register.js
import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../assets/css/Register.css";
import visibleIcon from "../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../assets/imgs/Icons/notvisible.png";
import logo from "../assets/imgs/YU_logo/YU.webp";
import { registerUser } from "../redux/usersSlice";

const Modal = lazy(() => import("./PasswordRequirementsRegister"));

const Register = () => {
  // estados de form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // mensagens / alerts
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const [alertPass, setAlertPass] = useState("");

  // requisitos de password
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
  });

  // modal de requisitos
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const togglePasswordModal = () =>
    setIsPasswordModalOpen((open) => !open);

  // toggles de visibilidade
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redux + navegação
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: registerError } = useSelector(
    (state) => state.user
  );

  // validação de password
  const validatePassword = (pwd) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),._?":{}|<->]/.test(pwd);

    setPasswordRequirements({
      minLength: pwd.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    });

    return (
      pwd.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handlePasswordChange = (e) => {
    const nova = e.target.value;
    setPassword(nova);
    validatePassword(nova);
  };

  // envio do form
  const handleRegister = () => {
    // 1) validações locais
    const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;
    if (invalidUsernameChars.test(username)) {
      setAlert("Nome de utilizador contém caracteres inválidos!");
      setAlertPass("");
      return;
    }
    setAlert("");

    if (!validatePassword(password)) {
      setAlertPass("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }
    if (password !== confirmPassword) {
      setAlertPass("As palavras-passe não coincidem!");
      return;
    }
    setAlertPass("");

    // 2) dispara o thunk de registo
    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        setMessage("Utilizador registado com sucesso!");
        // limpar form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // navegar
        navigate("/apresentacao");
      })
      .catch((errMsg) => {
        // mostra o erro do servidor
        setAlert(errMsg);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img
              rel="preload"
              as="image"
              src={logo}
              alt="logo"
              className="logo"
              width="300"
              height="300"
            />
          </div>
          <header>
            <h1>Registo</h1>
          </header>

          {/* Alertas de erro */}
          {alert && <p className="alert">{alert}</p>}

          <div className="label-container">
            <label htmlFor="input-email">
              Email <span className="alert">*</span>
            </label>
            <input
              rel="preload"
              required
              id="input-email"
              type="email"
              className="input"
              placeholder="Inserir email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="user-container">
            <label htmlFor="input-utilizador">
              Nome de Utilizador <span className="alert">*</span>
            </label>
            <input
              required
              id="input-utilizador"
              type="text"
              className="input"
              placeholder="Inserir nome de utilizador..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="pass-container">
            <div className="password-input-wrapper">
              <div className="password-label-container">
                <label htmlFor="password_input">
                  Palavra-passe <span className="alert">*</span>
                </label>
                <button
                  aria-label="Requisitos para password"
                  type="button"
                  className="password-info-button"
                  onClick={togglePasswordModal}
                >
                  <i className="bi bi-question-circle"></i>
                </button>
              </div>
              <div className="password-input-container">
                <input
                  id="password_input"
                  required
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="Inserir uma palavra-passe..."
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <img
                    src={showPassword ? visibleIcon : notVisibleIcon}
                    alt="toggle"
                    className="icons"
                  />
                </button>
              </div>
            </div>

            <div className="pass-container">
              <label htmlFor="input-password2">
                Confirmar Palavra-passe <span className="alert">*</span>
              </label>
              <div className="password-input-container">
                <input
                  required
                  id="input-password2"
                  type={showConfirmPassword ? "text" : "password"}
                  className="input"
                  placeholder="Confirmar palavra-passe..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() =>
                    setShowConfirmPassword((v) => !v)
                  }
                >
                  <img
                    src={
                      showConfirmPassword
                        ? visibleIcon
                        : notVisibleIcon
                    }
                    alt="toggle"
                    className="icons"
                  />
                </button>
              </div>
            </div>

            {/* Erro de password */}
            {alertPass && <p className="alert">{alertPass}</p>}
          </div>

          {/* Modal de requisitos */}
          <Suspense fallback={<div>Loading...</div>}>
            <Modal
              isOpen={isPasswordModalOpen}
              onClose={togglePasswordModal}
            >
              <ul className="password-requirements">
                <li
                  className={
                    passwordRequirements.minLength ? "valid" : "invalid"
                  }
                >
                  {passwordRequirements.minLength ? (
                    <i className="bi bi-check-circle"></i>
                  ) : (
                    <i className="bi bi-x-circle"></i>
                  )}
                  Pelo menos 6 caracteres
                </li>
                <li
                  className={
                    passwordRequirements.hasUpperCase
                      ? "valid"
                      : "invalid"
                  }
                >
                  {passwordRequirements.hasUpperCase ? (
                    <i className="bi bi-check-circle"></i>
                  ) : (
                    <i className="bi bi-x-circle"></i>
                  )}
                  Pelo menos uma letra maiúscula
                </li>
                <li
                  className={
                    passwordRequirements.hasLowerCase
                      ? "valid"
                      : "invalid"
                  }
                >
                  {passwordRequirements.hasLowerCase ? (
                    <i className="bi bi-check-circle"></i>
                  ) : (
                    <i className="bi bi-x-circle"></i>
                  )}
                  Pelo menos uma letra minúscula
                </li>
                <li
                  className={
                    passwordRequirements.hasNumbers ? "valid" : "invalid"
                  }
                >
                  {passwordRequirements.hasNumbers ? (
                    <i className="bi bi-check-circle"></i>
                  ) : (
                    <i className="bi bi-x-circle"></i>
                  )}
                  Pelo menos um número
                </li>
                <li
                  className={
                    passwordRequirements.hasSpecialChar
                      ? "valid"
                      : "invalid"
                  }
                >
                  {passwordRequirements.hasSpecialChar ? (
                    <i className="bi bi-check-circle"></i>
                  ) : (
                    <i className="bi bi-x-circle"></i>
                  )}
                  Pelo menos um caractere especial
                </li>
              </ul>
            </Modal>
          </Suspense>
        </div>

        <div className="register-link">
          <p>
            Já tens conta? <a href="/Login">Iniciar Sessão</a>
          </p>
        </div>

        {/* feedback de API */}
        {status === "loading" && <p>Registando…</p>}
        {registerError && <p className="alert">{registerError}</p>}
        {message && <p className="success">{message}</p>}

        <button className="buttonBig" type="submit">
          Registar
        </button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../assets/css/Register.css";
import visibleIcon from "../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../assets/imgs/Icons/notvisible.png";
import logo from "../assets/imgs/YU_logo/YU.webp";
import { registerUser } from "../redux/usersSlice";
import TermsModal from "./TermsModal";

const PasswordModal = lazy(() => import("./PasswordRequirementsRegister"));

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const [alertPass, setAlertPass] = useState("");

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const togglePasswordModal = () =>
    setIsPasswordModalOpen((open) => !open);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const toggleTermsModal = () =>
    setIsTermsModalOpen((open) => !open);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);

  const validatePassword = (pwd) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),._?":{}|<>-]/.test(pwd);

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
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleRegister = () => {
    // Se não aceitou termos, mostra alerta
    if (!termsAccepted) {
      setAlert("É necessário aceitar os termos antes de registar.");
      return;
    }

    // Validação nome de utilizador
    const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;
    if (invalidUsernameChars.test(username)) {
      setAlert("Nome de utilizador contém caracteres inválidos!");
      return;
    }
    setAlert("");

    // Validação password
    if (!validatePassword(password)) {
      setAlertPass("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }
    if (password !== confirmPassword) {
      setAlertPass("As palavras-passe não coincidem!");
      return;
    }
    setAlertPass("");

    // Dispara o dispatch
    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        setMessage("Utilizador registado com sucesso!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTermsAccepted(false);
        navigate("/questions");
      })
      .catch((errMsg) => setAlert(errMsg));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2" />
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img
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

          {alert && <p className="alert">{alert}</p>}

          <div className="label-container">
            <label htmlFor="input-email">
              Email <span className="alert">*</span>
            </label>
            <input
              id="input-email"
              type="email"
              required
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
              id="input-utilizador"
              type="text"
              required
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
                  type="button"
                  aria-label="Requisitos para password"
                  className="password-info-button"
                  onClick={togglePasswordModal}
                >
                  <i className="bi bi-question-circle" />
                </button>
              </div>
              <div className="password-input-container">
                <input
                  id="password_input"
                  type={showPassword ? "text" : "password"}
                  required
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

            <div className="password-confirm-container">
              <label htmlFor="input-password2">
                Confirmar Palavra-passe <span className="alert">*</span>
              </label>
              <div className="password-input-container">
                <input
                  id="input-password2"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="input"
                  placeholder="Confirmar palavra-passe..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  <img
                    src={showConfirmPassword ? visibleIcon : notVisibleIcon}
                    alt="toggle"
                    className="icons"
                  />
                </button>
              </div>
            </div>

            {alertPass && <p className="alert">{alertPass}</p>}
          </div>

          {/* Botão de termos */}
          <div className="terms-container">
            <button
              type="button"
              className={`buttonBig terms-button ${
                termsAccepted ? "active" : ""
              }`}
              onClick={toggleTermsModal}
            >
              Li e aceito os termos e condições
            </button>
          </div>
        </div>

        <div className="register-link">
          <p>
            Já tens conta? <a href="/login">Iniciar Sessão</a>
          </p>
        </div>

        {status === "loading" && <p>Registando…</p>}
        {message && <p className="success">{message}</p>}

        {/* O botão está sempre clicável; handleRegister exibirá alerta se não tiver aceitado */}
        <button className={`buttonBig ${termsAccepted ? "active" : ""}`} type="submit">
          Registar
        </button>
      </form>

      <Suspense fallback={<div>Loading...</div>}>
        <PasswordModal isOpen={isPasswordModalOpen} onClose={togglePasswordModal} />
      </Suspense>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={toggleTermsModal}
        onAccept={() => {
          setTermsAccepted(true);
          setAlert("");  // limpa alerta se existir
        }}
      />
    </div>
  );
};

export default Register;

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
  // Estados de formulário
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Mensagens / alerts
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const [alertPass, setAlertPass] = useState("");

  // Requisitos de password
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
  });

  // Modais
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const togglePasswordModal = () => setIsPasswordModalOpen((open) => !open);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const toggleTermsModal = () => setIsTermsModalOpen((open) => !open);

  // Toggles de visibilidade
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redux + navegação
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);

  // Validação de password
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

  // Envio do formulário
  const handleRegister = () => {
    // 1) Verificar termos aceites
    if (!termsAccepted) {
      setAlert("É necessário aceitar os termos antes de registar.");
      return;
    }

    // 2) Validação de nome de utilizador
    const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;
    if (invalidUsernameChars.test(username)) {
      setAlert("Nome de utilizador contém caracteres inválidos!");
      setAlertPass("");
      return;
    }
    setAlert("");

    // 3) Validação de password
    if (!validatePassword(password)) {
      setAlertPass("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }
    if (password !== confirmPassword) {
      setAlertPass("As palavras-passe não coincidem!");
      return;
    }
    setAlertPass("");

    // 4) Dispatch do thunk de registo
    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        setMessage("Utilizador registado com sucesso!");
        // Limpar formulário
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTermsAccepted(false);
        // Navegar para a página de apresentação
        navigate("/apresentacao");
      })
      .catch((errMsg) => {
        setAlert(errMsg);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  const isFormComplete =
    email.trim() !== "" &&
    username.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    termsAccepted;

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2" />
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

          {alert && <p className="alert">{alert}</p>}

          <div className="label-container">
            <label htmlFor="input-email">
              Email <span className="alert">*</span>
            </label>
            <input
              rel="preload"
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
                  <button
                    type="button"
                    aria-label="Requisitos para password"
                    className="password-info-button"
                    onClick={togglePasswordModal}
                  >
                    <i
                      className={`bi bi-question-circle icons ${
                        Object.values(passwordRequirements).every(Boolean)
                          ? "icon-green"
                          : "icon-red"
                      }`}
                    />
                  </button>
                </label>
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

          <div className="terms-container">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setAlert("");
                }}
                required
              />
              Li e aceito os&nbsp;
              <span
                className="terms-link"
                style={{
                  color: "var(--purple-dark)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={toggleTermsModal}
                tabIndex={0}
                role="button"
              >
                Termos e Condições
              </span>
            </label>
          </div>
        </div>

        <div className="register-link">
          <p>
            Já tens conta? <a href="/login">Iniciar Sessão</a>
          </p>
        </div>

        {status === "loading" && <p>A registar utilizador…</p>}
        {message && <p className="success">{message}</p>}

        <button
          className="buttonBig"
          type="submit"
          disabled={!isFormComplete}
          onClick={handleRegister}
        >
          Registar
        </button>
      </form>

      <Suspense fallback={<div>Loading...</div>}>
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={togglePasswordModal}
        >
          {/* ... requisitos de password ... */}
        </PasswordModal>
      </Suspense>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={toggleTermsModal}
        onAccept={() => {
          setTermsAccepted(true);
          setAlert("");
        }}
      />
    </div>
  );
};

export default Register;

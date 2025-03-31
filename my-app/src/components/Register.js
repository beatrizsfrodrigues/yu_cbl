import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/usersSlice";
import { fetchMascot } from "../redux/mascotSlice";
import "../assets/css/Register.css";
import visibleIcon from "../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../assets/imgs/Icons/notvisible.png";
import logo from "../assets/imgs/YU_logo/YU.webp";
const Modal = lazy(() => import("./PasswordRequirementsRegister"));

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const togglePasswordModal = () => {
    setIsPasswordModalOpen(!isPasswordModalOpen);
  };

  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false); //Controla a visibilidade do pop-up de requisitos da password
  const [showPassword, setShowPassword] = useState(false); //Controla a visibilidade da palavra-passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); //Controla a visibilidade da confirmação da palavra-passe

  const [validationInputs, setValidationInputs] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data) || [];
  const usersStatus = useSelector((state) => state.users.status);
  const mascot = useSelector((state) => state.mascot.data) || [];
  const mascotStatus = useSelector((state) => state.mascot.status);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
    if (mascotStatus === "idle") {
      dispatch(fetchMascot());
    }
  }, [usersStatus, mascotStatus, dispatch]);

  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code;
    const generateRandomCode = () => {
      let result = "";
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    do {
      code = generateRandomCode();
    } while (users.some((user) => user.code === code));
    return code;
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),._?":{}|<->]/.test(password);

    setPasswordRequirements({
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    });

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleRegister = () => {
    const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;

    if (invalidUsernameChars.test(username)) {
      setAlert("Nome de utilizador contem caracteres inválidos!");
      setAlertPass("");
      return;
    }

    if (users.some((user) => user.username === username.toLocaleLowerCase())) {
      setAlert("Nome de utilizador já existente!");
      setAlertPass("");
      return;
    } else {
      setAlert("");
    }

    if (!validatePassword(password)) {
      setAlertPass("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }

    if (password !== confirmPassword) {
      setAlertPass("As palavras-passe não coincidem!");
      return;
    }

    const newUser = {
      id: users.length + 1,
      code: generateCode(),
      username,
      email,
      password,
      points: 0,
      partnerId: null,
      tasks: [],
      initialFormAnswers: [],
    };

    const newMascot = {
      id: mascot.length + 1,
      userId: newUser.id,
      accessoriesOwned: [40],
      accessoriesEquipped: {
        hat: null,
        shirt: null,
        color: 40,
        background: null,
      },
    };

    const updatedUsers = [...users, newUser];
    const updatedMascot = [...mascot, newMascot];

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("mascot", JSON.stringify(updatedMascot));
    localStorage.setItem("loggedInUser", JSON.stringify({ id: newUser.id }));
    setMessage("Utilizador registado com sucesso!");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAlert("");
    setAlertPass("");
    navigate("/apresentacao");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
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
              height="300" /* Set explicit height */
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
              required
              id="input-email"
              type="email"
              className={`input ${validationInputs.email ? "error" : ""}`}
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
              className={`input ${validationInputs.username ? "error" : ""}`}
              placeholder="Inserir nome de utilizador..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="pass-container">
            <div className="password-input-wrapper">
              <div className="password-label-container">
                <label for="password_input">
                  Palavra-passe <span className="alert">*</span>{" "}
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
                  className={`input ${
                    validationInputs.password ? "error" : ""
                  }`}
                  placeholder="Inserir uma palavra-passe..."
                  value={password}
                  onChange={handlePasswordChange}
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

            <div className="pass-container">
              <label htmlFor="input-password2">
                Confirmar Palavra-passe <span className="alert">*</span>
              </label>
              <div className="password-input-container">
                <input
                  required
                  id="input-password2"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input ${
                    validationInputs.confirmPassword ? "error" : ""
                  }`}
                  placeholder="Confirmar palavra-passe..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? notVisibleIcon : visibleIcon}
                    alt="Mostrar palavra-passe"
                  />
                </button>
              </div>
            </div>
            {alertPass && <p className="alert">{alertPass}</p>}
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Modal isOpen={isPasswordModalOpen} onClose={togglePasswordModal}>
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
                    passwordRequirements.hasUpperCase ? "valid" : "invalid"
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
                    passwordRequirements.hasLowerCase ? "valid" : "invalid"
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
                    passwordRequirements.hasSpecialChar ? "valid" : "invalid"
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
            Já tens conta? <a href="/Login">Iniciar Sessão</a>{" "}
          </p>
        </div>
        {message && <p>{message}</p>}
        <button className="buttonBig" type="submit">
          Registar
        </button>
      </form>
    </div>
  );
};

export default Register;

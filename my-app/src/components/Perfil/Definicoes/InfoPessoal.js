import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/usersSlice";
import { fetchMascot } from "../../../redux/mascotSlice";
import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";
import logo from "../../../assets/imgs/YU_logo/YU.svg";

const InfoPessoal = () => {
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

    const inputErrors = {
      username: username.trim() === "",
      email: email.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
    };

    setValidationInputs(inputErrors);

    if (Object.values(inputErrors).some((input) => input)) {
      setAlert("Por favor preencha todos os campos!");
      return;
    }

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

  const isFormComplete =
    email.trim() !== "" &&
    password.trim() !== "" &&
    username.trim() !== "" &&
    confirmPassword.trim() !== "";

  return (
    <div className="mainBody">
      <div className="backgroundDiv backgroundDiv2"></div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          {alert && <p className="alert">{alert}</p>}
          <div className="label-container">
            <label>Email</label>
            <input
              type="text"
              className={`input ${validationInputs.email ? "error" : ""}`}
              placeholder="Inserir email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {validationInputs.email && (
              <p className="alert">Por favor preencha este campo!</p>
            )}
          </div>
          <div className="user-container">
            <label>Nome de Utilizador</label>
            <input
              type="text"
              className={`input ${validationInputs.username ? "error" : ""}`}
              placeholder="Inserir nome de utilizador..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {validationInputs.username && (
              <p className="alert">Por favor preencha este campo!</p>
            )}
          </div>
          {alertPass && <p className="alert">{alertPass}</p>}
          <div className="pass-container">
            <label>Palavra-passe</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className={`input ${validationInputs.password ? "error" : ""}`}
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
            {validationInputs.password && (
              <p className="alert">Por favor preencha este campo!</p>
            )}
            <button
              aria-label="Requisitos para password"
              type="button"
              className="password-info-button"
              onClick={() =>
                setShowPasswordRequirements(!showPasswordRequirements)
              }
            >
              <i className="bi bi-question-circle"></i>
            </button>
            {showPasswordRequirements && (
              <div className="password-requirements-popup">
                <ul className="password-requirements">
                  <li
                    className={
                      passwordRequirements.minLength ? "valid" : "invalid"
                    }
                  >
                    Pelo menos 6 caracteres
                  </li>
                  <li
                    className={
                      passwordRequirements.hasUpperCase ? "valid" : "invalid"
                    }
                  >
                    Pelo menos uma letra maiúscula
                  </li>
                  <li
                    className={
                      passwordRequirements.hasLowerCase ? "valid" : "invalid"
                    }
                  >
                    Pelo menos uma letra minúscula
                  </li>
                  <li
                    className={
                      passwordRequirements.hasNumbers ? "valid" : "invalid"
                    }
                  >
                    Pelo menos um número
                  </li>
                  <li
                    className={
                      passwordRequirements.hasSpecialChar ? "valid" : "invalid"
                    }
                  >
                    Pelo menos um caractere especial
                  </li>
                </ul>
              </div>
            )}
          </div>
          {password && (
            <div className="pass-container">
              <label>Confirmar Palavra-passe</label>
              <div className="password-input-container">
                <input
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
              {validationInputs.confirmPassword && (
                <p className="alert">Por favor preencha este campo!</p>
              )}
            </div>
          )}
        </div>

        <div className="register-link">
          <p>
            Já tens conta? <a href="/Login">Iniciar Sessão</a>{" "}
          </p>
        </div>
        {message && <p>{message}</p>}
        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete}
        >
          Registar
        </button>
      </form>
    </div>
  );
};

export default InfoPessoal;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/usersSlice";
import {fetchMascot} from "../redux/mascotSlice";
import "../assets/css/Register.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const [alertPass, setAlertPass] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    //Definição dos critérios da password como falso por default
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data) || [];
  const usersStatus = useSelector((state) => state.users.status);
  const mascot = useSelector((state) => state.mascot.data) || [];
  const mascotStatus = useSelector((state) => state.mascot.status);

  //Fetch users e mascot data
  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
    if (mascotStatus === "idle") {
      dispatch(fetchMascot());
    }
  }, [usersStatus, mascotStatus, dispatch]);
  
  //Função para criar código único de um novo utilizador
  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code;
    do {
      code = "";
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
    } while (users.some((user) => user.code === code));
    return code;
  };

  // Função para validar se a password corresponde aos critérios obrigatórios
  const validatePassword = (password) => {
    const minLength = 6; //Número mínimo de caracteres
    const hasUpperCase = /[A-Z]/.test(password); //Verifica se a password tem letras maiúsculas
    const hasLowerCase = /[a-z]/.test(password); //Verifica se a password tem letras minúsculas
    const hasNumbers = /[0-9]/.test(password); //Verifica se a password tem números
    const hasSpecialChar = /[!@#$%^&*(),._?":{}|<->]/.test(password); //Verifica se a password tem caracteres especiais

    //Utualiza passwordRequirements com os resultados da verificação feita acima
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

  //Função para adicionar um 0 no início sempre que o utilizador introduzir apenas 1 algarismo
  const formatBirthdate = (setter) => (e) => {
    const value = e.target.value;
    if (value.length === 1) {
      setter(`0${value}`);
    } else {
      setter(value);
    }
  };

  const handleRegister = () => {
    //Caracteres inválidos no username
    const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;

    //Verifica se o username tem algum caracter inválido e alerta o utilizador caso seja verdade
    if (invalidUsernameChars.test(username)) {
      setAlert("Nome de utilizador contem caracteres inválidos!");
      setAlertPass("");
      return;
    }

    //Verifica se o utilizador registado j´´a existe ou não e alerta o utilizador caso seja verdade
    if (users.some((user) => user.username === username.toLocaleLowerCase())) {
      setAlert("Nome de utilizador já existente!");
      setAlertPass("");
      return;
    } else {
      setAlert("");
    }

    //Verifica se a password introduzida na criação da password e na verificação da mesma são iguais e alerta o utilizador caso estas não coincidam
    if (password !== confirmPassword) {
      setAlertPass("As palavras-passe não coincidem!");
      return;
    }

    //Parâmetros agregados à criação de um novo utilizador
    const newUser = {
      id: users.length + 1,
      code: generateCode(),
      username,
      email,
      password,
      age: `${day}/${month}/${year}`,
      points: 0,
      partnerID: null,
      tasks: [],
      initialFormAnswers: [],
    };

    //Parâmetros para uma nova mascote agregados à criação de um novo utilizador
    const newMascot = {
      id: mascot.lenght + 1,
      userId: newUser.id ,
      accessoriesOwned: [40],
      accessoriesEquipped: {
        hat: null,
        shirt: null,
        color: 40,
        background: null
      }
    }

    //Update do objeto users para introduzir um novo utilizador criado
    const updatedUsers = [...users, newUser];
    const updatedMascot = [...mascot, newMascot]

    //Guarda em localstorage os utilizadores e respetivos ids e mascotes e limpa campos de inputs e mensagens de erro existentes ao fazer um registo com sucesso
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("mascot", JSON.stringify(updatedMascot));
    localStorage.setItem("loggedInUser", JSON.stringify({ id: newUser.id })); //Guarda o id do utilizador que fez login
    setMessage("Utilizador registado com sucesso!");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setDay("");
    setMonth("");
    setYear("");
    setAlert("");
    setAlertPass("");
    navigate("/apresentacao");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  //Atualiza a password para os valores inseridos no input e valida se a mesma corresponde aos critérios obrigatórios
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  //Apenas deixa avançar com o registo quando todos os campos do formulário dorem preenchidos
  const isFormComplete =
    email.trim() !== "" &&
    password.trim() !== "" &&
    username.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    day.trim() !== "" &&
    month.trim() !== "" &&
    year.trim() !== "";

  return (
    <div className="mainBody">
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          {/*Alerta de username já existente e username com caracteres inválidos*/}
          {alert && <p className="alert">{alert}</p>}
          <div className="label-container">
            <label>Email</label>
            <input
              type="text"
              placeholder="Inserir email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="user-container">
            <label>Nome de Utilizador</label>
            <input
              type="text"
              placeholder="Inserir nome de utilizador..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="birthdate-container">
            <label>Data de Nascimento</label>
            <div className="birthdate-inputs">
              <input
                type="number"
                placeholder="Dia"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                onBlur={formatBirthdate(setDay)}
                min="1" //Definição de número mínimo e máximo para o campo do Dia
                max="31"
              />
              <input
                type="number"
                placeholder="Mês"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                onBlur={formatBirthdate(setMonth)}
                min="1" //Definição de número mínimo e máximo para o campo do Mês
                max="12"
              />
              <input
                type="number"
                placeholder="Ano"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear()} //Definição de número mínimo e máximo para o campo do Ano, o ano nunca pode exceder o ano atual
              />
            </div>
          </div>
          {/*Alerta de passwords não corresponderem*/}
          {alertPass && <p className="alert">{alertPass}</p>}
          <div className="pass-container">
            <label>Palavra-passe</label>
            <input
              type="password"
              placeholder="Inserir uma palavra-passe..."
              value={password}
              onChange={handlePasswordChange}
            />
            {/*Lista de critérios obrigatórios da password que se verificam a verde conforme o seu cumprimento*/}
            <ul className="password-requirements">
              <li
                className={passwordRequirements.minLength ? "valid" : "invalid"}
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
          {password && (
            <div className="pass-container">
              <label>Confirmar Palavra-passe</label>
              <input
                type="password"
                placeholder="Confirmar palavra-passe..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="register-link">
          <p>
            Já tens conta? <a href="/Login">Login</a>{" "}
          </p>
        </div>
        {message && <p>{message}</p>}
        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} //O botão está inativo enquanto o formulário não é preenchido
        >
          Registar
        </button>
      </form>
    </div>
  );
};

export default Register;

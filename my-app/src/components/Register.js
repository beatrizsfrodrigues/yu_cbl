import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers} from "../redux/usersSlice";
import "../assets/css/Register.css";
import logo from "../assets/imgs/YU_logo/YU_boneca_a_frente.svg";
//import bolas from "../assets/imgs/YU_bolas/Group 97.svg";

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

    //Fetch users data
    useEffect(() => {
      if (usersStatus === "idle") {
        dispatch(fetchUsers());
      }
    }, [usersStatus, dispatch]);

  
  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    do{
      code = '';
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    } while (users.some( user => user.code === code))  
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

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const formatBirthdate = (setter) => (e) => {
      const value = e.target.value;
      if (value.length === 1) {
        setter(`0${value}`);
      } else {
        setter(value);
      }
    };

  const handleRegister = () => {
  const invalidUsernameChars = /[\\/"[\]:|<>+=;,?*@\s]/;

    if (invalidUsernameChars.test(username)) {
      setAlert('Nome de utilizador contem caracteres inválidos!');
      setAlertPass('');
      return;
    }

    if (users.some(user => user.username === username.toLocaleLowerCase())) {
      setAlert('Nome de utilizador já existente!');
      setAlertPass('');
      return; 
    } else {
      setAlert('');
    }

    if (password !== confirmPassword) {
      setAlertPass('As palavras-passe não coincidem!');
      return;
    }

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

    const updatedUsers = [...users, newUser]; 

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setMessage('Utilizador registado com sucesso!');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDay('');
    setMonth('');
    setYear('');
    setAlert('');
    setAlertPass('');
    navigate('/Login');
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

  const isFormComplete = email.trim() !== "" && password.trim() !== "" && username.trim() !== "" && confirmPassword.trim() !== "" && day.trim() !== "" && month.trim() !== "" && year.trim() !== "";
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
            {/*<img src={bolas} alt="bolas" className="bolas" />*/}
          </div>
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
                min="1"
                max="31"
              />
              <input
                type="number"
                placeholder="Mês"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                onBlur={formatBirthdate(setMonth)}
                min="1"
                max="12"
              />
              <input
                type="number"
                placeholder="Ano"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          {alertPass && <p className="alert">{alertPass}</p>}
          <div className="pass-container">
            <label>Palavra-passe</label>
            <input
              type="password"
              placeholder="Inserir uma palavra-passe..."
              value={password}
              onChange={handlePasswordChange}
            />
            <ul className="password-requirements">
              <li className={passwordRequirements.minLength ? "valid" : "invalid"}>Pelo menos 6 caracteres</li>
              <li className={passwordRequirements.hasUpperCase ? "valid" : "invalid"}>Pelo menos uma letra maiúscula</li>
              <li className={passwordRequirements.hasLowerCase ? "valid" : "invalid"}>Pelo menos uma letra minúscula</li>
              <li className={passwordRequirements.hasNumbers ? "valid" : "invalid"}>Pelo menos um número</li>
              <li className={passwordRequirements.hasSpecialChar ? "valid" : "invalid"}>Pelo menos um caractere especial</li>
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
          <p>Já tens conta? <a href="/Login">Login</a>{" "}</p>
        </div>
        {message && <p>{message}</p>}
        <button
          className={`buttonBig ${isFormComplete ? "active" : ""}`}
          type="submit"
          disabled={!isFormComplete} // Disable button if form is incomplete
        >Registar</button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import "../assets/css/Register.css";
import logo from "../assets/imgs/YU_logo/YU-03.svg";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div>
      {/* <h1>Login</h1> */}
      <form onSubmit={handleSubmit}>
        <div>
          <img
            src={logo}
            alt="icon"
            style={{ width: "100%", marginBottom: "20px" }}
          />
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Nome de Utilizador</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Palavra-passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="buttonBig" type="submit">
          Registar
        </button>
      </form>
    </div>
  );
};

export default Register;

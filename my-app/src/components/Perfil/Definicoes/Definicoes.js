import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Definicoes/Definicoes.css";
import { X } from "react-feather";

const Definicoes = () => {
  const [canAccessQuestions, setCanAccessQuestions] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(""); // To store the time remaining in readable format
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const questionTimes = JSON.parse(localStorage.getItem("questionTimes")) || {};
    const lastTime = loggedInUser?.id ? questionTimes[loggedInUser.id] : null;

    if (lastTime) {
      const now = Date.now();
      const diffInMilliseconds = now - Number(lastTime);
      
      // Calculate time remaining in seconds
      const diffInSeconds = diffInMilliseconds / 1000;
      const remainingTime = Math.max(2592000 - diffInSeconds, 0);  // Ensures no negative time

      if (remainingTime <= 0) {
        setCanAccessQuestions(true);
      } else {
        setCanAccessQuestions(false);

        // Convert remaining time to a human-readable format (hours, minutes)
        const hoursTotal = Math.floor(remainingTime / 3600);
        const days = Math.floor(hoursTotal / 24);
        const hours = hoursTotal % 24;
        const minutes = Math.floor((remainingTime % 3600) / 60);

        let formattedTime = "";
        if (days > 0) {
          formattedTime += `${days} dia${days > 1 ? 's' : ''}, `;
        }
        if (hours > 0) {
          formattedTime += `${hours} hora${hours > 1 ? 's' : ''}, `;
        }
        if (minutes > 0 || (hours === 0 && days === 0)) {
          formattedTime += `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        }


        setTimeRemaining(formattedTime);
      }
    } else {
      // Se o utilizador nunca tiver respondido ao questionário, permitir acesso imediato
      setCanAccessQuestions(true);
    }

    // User's partner info handling (keeping it as it was)
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (loggedInUser) {
      const currentUser = storedUsers.find((u) => u.id === loggedInUser.id);
      if (currentUser?.partnerId) {
        const partner = storedUsers.find((u) => u.id === currentUser.partnerId);
        if (partner) {
          setPartnerName(partner.username);
          setPartnerCode(partner.code);
        } else {
          setPartnerName("Utilizador Desconhecido");
          setPartnerCode("Código Desconhecido");
        }
      }
    }
  }, []);

  const onConnectionClick = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find((u) => u.id === loggedInUser?.id);

    if (currentUser?.partnerId) {
      alert(
        `Já tens uma ligação com:\n\nParceiro: ${partnerName}\nCódigo do Parceiro: ${partnerCode}`
      );
    } else {
      navigate("/connection");
    }
  };

  const handleClose = () => {
    navigate("/profile");
  };

  const goToInfoPessoal = () => {
    navigate("/infopessoal");
  };

  return (
    <div className="definicoes-page">
      <div className="settings-header">
        <header>Definições</header>
        <button
          className="closeWindow"
          onClick={handleClose}
          aria-label="Fechar janela"
        >
          <X className="icons" />
        </button>
      </div>
      <div className="line"></div>

      <div className="settings-content">
        <div>
          <div className="settings-section">
            <h3>A tua conta</h3>
            <button className="settings-button" onClick={goToInfoPessoal}>
              Os meus dados
            </button>

            <button className="settings-button" onClick={onConnectionClick}>
              Fazer Ligação
            </button>

            <button
              className="settings-button"
              disabled={!canAccessQuestions}
              onClick={canAccessQuestions ? () => navigate("/questions") : undefined}
              style={{
                opacity: canAccessQuestions ? 1 : 0.5,
                cursor: canAccessQuestions ? "pointer" : "not-allowed",
              }}
            >
              {canAccessQuestions
                ? "Refazer questionário"
                : <>
                    Próximo questionário em:<br />
                    {timeRemaining}
                  </>
}
            </button>
          </div>

          <div className="settings-section">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => localStorage.removeItem("loggedInUser")}
            >
              <button className="settings-button logout">Sair</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Definicoes;

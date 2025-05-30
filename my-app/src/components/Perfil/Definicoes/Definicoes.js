// src/components/Definicoes/Definicoes.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Definicoes/Definicoes.css";

const Definicoes = ({ show, onClose }) => {
  const [canAccessQuestions, setCanAccessQuestions] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const questionTimes =
      JSON.parse(localStorage.getItem("questionTimes")) || {};
    const lastTime = loggedInUser?.id ? questionTimes[loggedInUser.id] : null;

    if (lastTime) {
      const now = Date.now();
      const diffInMilliseconds = now - Number(lastTime);
      const diffInSeconds = diffInMilliseconds / 1000;
      const remainingTime = Math.max(2592000 - diffInSeconds, 0);

      if (remainingTime <= 0) {
        setCanAccessQuestions(true);
      } else {
        setCanAccessQuestions(false);
        const hoursTotal = Math.floor(remainingTime / 3600);
        const days = Math.floor(hoursTotal / 24);
        const hours = hoursTotal % 24;
        const minutes = Math.floor((remainingTime % 3600) / 60);

        let formattedTime = "";
        if (days > 0) formattedTime += `${days} dia${days > 1 ? "s" : ""}, `;
        if (hours > 0)
          formattedTime += `${hours} hora${hours > 1 ? "s" : ""}, `;
        if (minutes > 0 || (hours === 0 && days === 0))
          formattedTime += `${minutes} minuto${minutes > 1 ? "s" : ""}`;

        setTimeRemaining(formattedTime);
      }
    } else {
      setCanAccessQuestions(true);
    }

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
      setShowPopup(true);
    } else {
      navigate("/connection");
    }
  };

  const closePopup = () => setShowPopup(false);
  const goToInfoPessoal = () => navigate("/infopessoal");
  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="window" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Definições</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            class="icons"
          ></ion-icon>
        </div>

        <div className="line"></div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>A tua conta</h3>
            <button className="settings-button" onClick={goToInfoPessoal}>
              Os meus dados
            </button>
            <button className="settings-button" onClick={onConnectionClick}>
              Fazer Ligação
            </button>
            {showPopup && (
              <div className="popup-overlay" onClick={closePopup}>
                <div
                  className="popup-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Ligação Existente</h3>
                  <p>
                    Já tens uma ligação com:
                    <br />
                    <strong>Parceiro:</strong> {partnerName}
                    <br />
                    <strong>Código do Parceiro:</strong> {partnerCode}
                  </p>
                  <button className="close-popup-button" onClick={closePopup}>
                    Fechar
                  </button>
                </div>
              </div>
            )}
            <button
              className="settings-button"
              disabled={!canAccessQuestions}
              onClick={
                canAccessQuestions ? () => navigate("/questions") : undefined
              }
              style={{
                opacity: canAccessQuestions ? 1 : 0.5,
                cursor: canAccessQuestions ? "pointer" : "not-allowed",
              }}
            >
              {canAccessQuestions ? (
                "Refazer questionário"
              ) : (
                <>
                  Próximo questionário em:
                  <br />
                  {timeRemaining}
                </>
              )}
            </button>
            <button className="settings-button">Arquivo de respostas</button>

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

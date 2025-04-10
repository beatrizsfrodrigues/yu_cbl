import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Definicoes/Definicoes.css";
import { X } from "react-feather";

const Definicoes = () => {
  const [partnerName, setPartnerName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Definicoes/Definicoes.css";
import { X } from "react-feather";

const Definicoes = ({
  show,
  onClose,
  onInfoPessoalClick,
  onArquivoClick,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  useEffect(() => {
    console.log("Buscando dados do Local Storage...");
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    console.log("Logged in User:", loggedInUser);

    if (loggedInUser) {
      const currentUser = storedUsers.find((u) => u.id === loggedInUser.id);
      console.log("Current User:", currentUser);

      if (currentUser?.partnerId) {
        const partner = storedUsers.find((u) => u.id === currentUser.partnerId);
        if (partner) {
          console.log("Parceiro encontrado:", partner);
          setPartnerName(partner.username);
          setPartnerCode(partner.code); // Armazenar o código do parceiro
        } else {
          console.log("Parceiro não encontrado.");
          setPartnerName("Utilizador Desconhecido");
          setPartnerCode("Código Desconhecido");
        }
      } else {
        console.log("O usuário não tem um parceiro associado.");
      }
    } else {
      console.log("Nenhum usuário logado encontrado.");
    }
  }, []);

  const onConnectionClick = () => {
    console.log("Verificando conexão...");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find((u) => u.id === loggedInUser?.id);

    console.log("Current User no botão:", currentUser);

    if (currentUser?.partnerId) {
      console.log("Exibindo modal...");
      setShowModal(true);
    } else {
      console.log("Redirecionando para conexão...");
      window.location.href = "/connection";
    }
  };

  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="window" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Definições</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>

        <div className="settings-section" style={{ display: "block" }}>
          <h3>A tua conta</h3>
          <button className="settings-button" onClick={onInfoPessoalClick}>
            Os meus dados
          </button>

          <button className="settings-button" onClick={onArquivoClick}>
            As minhas Tarefas Concluídas
          </button>

          <button className="settings-button" onClick={onConnectionClick}>
            Fazer Ligação
          </button>
        </div>
        <div className="settings-section" style={{ display: "block" }}>
          <h3>Saídas</h3>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => localStorage.removeItem("loggedInUser")}
          >
            <button className="settings-button logout">Sair</button>
          </Link>
          <br />
        </div>
      </div>

      {/* Modal para exibir informações da ligação */}
      {showModal && (
        <div className="ligacao-overlay" onClick={(e) => { e.stopPropagation(); setShowModal(false); }}>
          <div className="ligacao-content" onClick={(e) => e.stopPropagation()}>
            <div className="ligacao-header">
              <h2>Já tens uma ligação feita</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
              </button>
            </div>
            <p>
              <strong>Parceiro:</strong> {partnerName || "Desconhecido"}
            </p>
            <p>
              <strong>Código do Parceiro:</strong>{" "}
              {partnerCode || "Código Desconhecido"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Definicoes;

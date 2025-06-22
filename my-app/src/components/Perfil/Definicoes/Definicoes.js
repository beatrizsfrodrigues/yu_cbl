import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Definicoes/Definicoes.css";

import { getAuthUser, clearAuthStorage } from "../../../utils/storageUtils";
import { fetchPartnerUser } from "../../../redux/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../Avatar.jsx";

import Termos from "./Termos";
import Privacidade from "./Privacidade";
import TermosUso from "./TermosUso";
import InfoPessoal from "./InfoPessoal";

const Definicoes = ({ show, onClose }) => {
  const [isOpen, setIsOpen] = useState(show);

  // Estados dos modais secundários
  const [showTermos, setShowTermos] = useState(false);
  const [showPriv, setShowPriv] = useState(false);
  const [showUso, setShowUso] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Autenticação e partner
  const [authUser] = useState(getAuthUser());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUserRedux = useSelector((state) => state.user.authUser);
  const partner = useSelector((state) => state.user.partnerUser);
  const accessories = useSelector((state) => state.accessories.data);

  // Popup de ligação existente
  const [showPopup, setShowPopup] = useState(false);

  // Controle de acesso ao questionário
  const [canAccessQuestions, setCanAccessQuestions] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  useEffect(() => {
    const partnerId = authUserRedux?.partnerId || authUser?.partnerId;
    if (partnerId) {
      dispatch(fetchPartnerUser(partnerId));
    }
  }, [authUserRedux?.partnerId, authUser?.partnerId, dispatch]);

  useEffect(() => {
    const times = JSON.parse(localStorage.getItem("questionTimes")) || {};
    const last = authUser?.id ? times[authUser.id] : null;

    if (!last) {
      setCanAccessQuestions(true);
      return;
    }

    const now = Date.now();
    const elapsed = (now - Number(last)) / 1000;
    const remaining = Math.max(2_592_000 - elapsed, 0);

    if (remaining === 0) {
      setCanAccessQuestions(true);
    } else {
      setCanAccessQuestions(false);
      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const parts = [];
      if (days) parts.push(`${days} dia${days > 1 ? "s" : ""}`);
      if (hours) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
      parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);
      setTimeRemaining(parts.join(", "));
    }
  }, [authUser?.id]);

  const openTermos = () => { setIsOpen(false); setShowTermos(true); };
  const closeTermos = () => { setShowTermos(false); setIsOpen(true); };
  const openPriv = () => { setShowTermos(false); setShowPriv(true); };
  const closePriv = () => { setShowPriv(false); setIsOpen(true); };
  const openUso = () => { setShowTermos(false); setShowUso(true); };
  const closeUso = () => { setShowUso(false); setIsOpen(true); };
  const openInfo = () => { setIsOpen(false); setShowInfo(true); };
  const closeInfo = () => { setShowInfo(false); setIsOpen(true); };

  const onConnectionClick = () => {
    if (authUserRedux?.partnerId) {
      setShowPopup(true);
    } else {
      navigate("/connection");
    }
  };
  const closePopup = () => setShowPopup(false);

  if (!show) return null;

  return (
    <>
      {/* Modais Secundários */}
      <InfoPessoal show={showInfo} onClose={closeInfo} />
      <TermosUso show={showUso} onClose={closeUso} onBackToTermos={openTermos} />
      <Privacidade show={showPriv} onClose={closePriv} onBackToTermos={openTermos} />
      <Termos show={showTermos} onClose={closeTermos} onOpenPrivacidade={openPriv} onOpenTermosUso={openUso} />

      {/* Popup Ligação Existente */}
      {showPopup && partner && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {/* ... conteúdo do popup ... */}
          </div>
        </div>
      )}

      {/* Modal Principal Definições */}
      {isOpen && (
        <div className="modal modal-definicoes" onClick={onClose}>
          <div className="window" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Definições</h3>
              <ion-icon
                name="close-outline"
                onClick={onClose}
                className="icons"
                style={{ fontSize: "28px" }}
              />
            </div>
            <div className="line"></div>
            <div className="settings-content">
              <div className="settings-section">
                <h3>A tua conta</h3>
                <button className="settings-button" onClick={openInfo}>
                  Os meus dados
                </button>
                <button className="settings-button" onClick={onConnectionClick}>
                  Fazer Ligação
                </button>
                <button
                  className="settings-button"
                  onClick={() =>
                    navigate(
                      "/apresentacao",
                      { state: { from: "settings" } }
                    )
                  }
                >
                  Como Funciona a YU
                </button>
                <button className="settings-button" onClick={openTermos}>
                  Sobre a YU
                </button>
                <Link
                  to="/login"
                  onClick={clearAuthStorage}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <button className="settings-button logout">Sair</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Definicoes;

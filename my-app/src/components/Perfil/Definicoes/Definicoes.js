// Definicoes.js
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
  const [showTermos, setShowTermos] = useState(false);
  const [showPriv, setShowPriv] = useState(false);
  const [showUso, setShowUso] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [authUser] = useState(getAuthUser());
  const [showPopup, setShowPopup] = useState(false);
  const [canAccessQuestions, setCanAccessQuestions] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const partner = useSelector(state => state.user.partnerUser);
  const authUserRedux = useSelector(state => state.user.authUser);
  const accessories = useSelector(state => state.accessories.data);

  useEffect(() => {
    if (authUser?.partnerId) dispatch(fetchPartnerUser(authUser.partnerId));
  }, [authUser?.partnerId, dispatch]);

  useEffect(() => {
    if (authUserRedux?.partnerId) dispatch(fetchPartnerUser(authUserRedux.partnerId));
    const times = JSON.parse(localStorage.getItem("questionTimes")) || {};
    const last = authUser?.id ? times[authUser.id] : null;
    if (!last) { setCanAccessQuestions(true); return; }
    const left = Math.max(2592000 - ((Date.now() - Number(last)) / 1000), 0);
    if (left === 0) { setCanAccessQuestions(true); return; }
    setCanAccessQuestions(false);
    const days = Math.floor(left / 86400);
    const hours = Math.floor((left % 86400) / 3600);
    const minutes = Math.floor((left % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days} dia${days>1?"s":""}`);
    if (hours) parts.push(`${hours} hora${hours>1?"s":""}`);
    parts.push(`${minutes} minuto${minutes>1?"s":""}`);
    setTimeRemaining(parts.join(", "));
  }, [authUserRedux?.partnerId, authUser?.id, dispatch]);

  /* Handlers de Modal */
  const openTermos = () => { setIsOpen(false); setShowTermos(true); };
  const closeTermos = () => { setShowTermos(false); setIsOpen(true); };
  const openPriv = () => { setShowTermos(false); setShowPriv(true); };
  const closePriv = () => { setShowPriv(false); setIsOpen(true); };
  const openUso = () => { setShowTermos(false); setShowUso(true); };
  const closeUso = () => { setShowUso(false); setIsOpen(true); };
  const openInfo = () => { setIsOpen(false); setShowInfo(true); };
  const closeInfo = () => { setShowInfo(false); setIsOpen(true); };

  const onConnectionClick = () => authUserRedux?.partnerId ? setShowPopup(true) : navigate("/connection");
  const closePopup = () => setShowPopup(false);

  if (!show) return null;

  return (
    <>
      {/* Modais Secundários */}
      <InfoPessoal show={showInfo} onClose={closeInfo} />
      <TermosUso  show={showUso} onClose={closeUso} onBackToTermos={openTermos} />
      <Privacidade show={showPriv} onClose={closePriv} onBackToTermos={openTermos} />
      <Termos     show={showTermos} onClose={closeTermos} onOpenPrivacidade={openPriv} onOpenTermosUso={openUso} />

      {/* Popup Ligação */}
      {showPopup && partner && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={e=>e.stopPropagation()}>
            <h3>Ligação Existente</h3>
            <p>Já tens uma ligação com:<br/><strong>Parceiro:</strong> {partner.username}<br/><strong>Código:</strong> {partner.code}</p>
            <div className="avatars-container-popup">
              <div className="avatar-item-popup">
                <div className="avatar-username-popup">
                  {authUserRedux?.username || authUser?.username || "–"}
                </div>
                <div className="avatar-wrapper">
                  <Avatar
                    mascot={authUserRedux?.mascot || null}
                    equipped={authUserRedux?.accessoriesEquipped || {}}
                    accessoriesList={accessories}
                    size={64}
                  />
                </div>
              </div>

              <div className="dotted-line-popup"></div>

              <div className="avatar-item-popup">
                <div className="avatar-username-popup">{partner.username}</div>
                <div className="avatar-wrapper">
                  <Avatar
                    mascot={partner.mascot}
                    equipped={partner.accessoriesEquipped || {}}
                    accessoriesList={accessories}
                    size={64}
                  />
                </div>
              </div>
            </div>
            <button className="close-popup-button" onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal Principal Definições */}
      {isOpen && (
        <div className="modal modal-definicoes" onClick={onClose}>
          <div className="window" onClick={e=>e.stopPropagation()}>
            <div className="settings-header">
              <h3>Definições</h3>
              <ion-icon name="close-outline" onClick={onClose} className="icons" style={{fontSize:"28px"}} />
            </div>
            <div className="line"></div>
            <div className="settings-content">
              <div className="settings-section">
                <h3>A tua conta</h3>
                <button className="settings-button" onClick={openInfo}>Os meus dados</button>
                <button className="settings-button" onClick={onConnectionClick}>Fazer Ligação</button>
                <button className="settings-button" disabled={!canAccessQuestions} onClick={canAccessQuestions?()=>navigate("/questions"):undefined} style={{opacity:canAccessQuestions?1:0.5}}>
                  {canAccessQuestions?"Refazer questionário":<>Próximo questionário em:<br/>{timeRemaining}</>}
                </button>
                <button className="settings-button">Arquivo de respostas</button>
                <button className="settings-button" onClick={openTermos}>Sobre a YU</button>
                <Link to="/login" onClick={clearAuthStorage} style={{textDecoration:"none",color:"inherit"}}>
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

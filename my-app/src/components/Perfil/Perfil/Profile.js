import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Perfil/profile.css";
import Definicoes from "../Definicoes/Definicoes";
import InfoPessoal from "../Definicoes/InfoPessoal";
import Grafico from "../Grafico/Grafico";
import Messages from "../../Tasks/Messages";
import { fetchUsers } from "../../../redux/usersSlice.js";

const Profile = () => {
  const currentUserId = 1;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfoPessoal, setShowInfoPessoal] = useState(false);
  const [showGrafico, setShowGrafico] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("profile-background");

    return () => {
      root.classList.remove("profile-background");
    };
  }, []);

  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleGrafico = () => setShowGrafico(!showGrafico);

  const handleInfoPessoalClick = () => {
    setShowInfoPessoal(true);
    setShowSettings(false);
  };

  const closeSettings = () => setShowSettings(false);
  const closeGrafico = () => setShowGrafico(false);

  const backToSettings = () => {
    setShowInfoPessoal(false);
    setShowSettings(true);
  };

  const handleOpenMessagesModal = () => {
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  if (usersStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (usersStatus === "failed") {
    return <div>Error: {error}</div>;
  }

const currentUser =
    users && users.length > 0
      ? users.find((user) => user.id === currentUserId)
      : null;


      
  return (
    <div className="profile-container">
      {/* Header com título e ícone */}
      <header className="profile-header">
        <h1 className="profile-title">Perfil</h1>
        <span className="gear-icon bi bi-gear" onClick={toggleSettings}></span>
      </header>

      {/* Parte principal do perfil */}
      <div className="profile-avatar">
        <img
          src="/assets/YU_cores/YU-roxo.svg"
          alt="Avatar"
          className="avatar-image"
        />
        <h2 className="profile-name">Luísa</h2>
      </div>

      {/* Botões abaixo do nome */}
      <div className="profile-buttons">
        <button className="profile-button award">
          <span className="bi bi-bar-chart-line" onClick={toggleGrafico}></span>
        </button>

        <button className="profile-button circle">
          <Link to="/informacoes">
            <i className="bi bi-info-circle" ></i>
          </Link>
        </button>

        <button className="profile-button dots" onClick={handleOpenMessagesModal}>
          <i className="bi bi-chat-dots"></i>
        </button>
      </div>

      <Definicoes
        show={showSettings}
        onClose={closeSettings}
        onInfoPessoalClick={handleInfoPessoalClick}
      />

      <InfoPessoal show={showInfoPessoal} onBack={backToSettings} />

      <Grafico
        show={showGrafico}
        onClose={closeGrafico}
        monthlyData={[5, 10, 15, 20, 25]}
        yearlyData={[100, 200, 300, 400, 500]}
      />

      {isMessagesModalOpen && (
        <Messages
          onClose={handleCloseMessagesModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Profile;

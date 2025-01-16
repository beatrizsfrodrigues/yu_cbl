import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Perfil/profile.css";
import Definicoes from "../Definicoes/Definicoes";
import InfoPessoal from "../Definicoes/InfoPessoal";
import Arquivo from "../Definicoes/Arquivo";
import Grafico from "../Grafico/Grafico";
import Messages from "../../Tasks/Messages";
import { fetchUsers } from "../../../redux/usersSlice.js";

const Profile = () => {
  const navigate = useNavigate(); // Hook para redirecionar o user
  const loggedInUser = localStorage.getItem("loggedInUser");
  const currentUserId = loggedInUser ? JSON.parse(loggedInUser).id : null;
  /*const activeUser = useSelector((state) => state.users.data?.find((user) => user.id === 2));*/

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [showSettings, setShowSettings] = useState(false);
  const [showInfoPessoal, setShowInfoPessoal] = useState(false);
  const [showArquivo, setShowArquivo] = useState(false);
  const [showGrafico, setShowGrafico] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  useEffect(() => {
    if (!loggedInUser) {
      //Quando o user tem login feito
      navigate("/login");
    }
  }, [loggedInUser, navigate]);

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

  const handleArquivoClick = () => {
    setShowArquivo(true);
    setShowSettings(false);
  };

  const closeSettings = () => setShowSettings(false);
  const closeGrafico = () => setShowGrafico(false);

  const backToSettings = () => {
    setShowInfoPessoal(false);
    setShowArquivo(false);
    setShowSettings(true);
  };

  const handleOpenMessagesModal = () => {
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  if (!loggedInUser) {
    //mensagem de erro
    return (
      <div className="error-message">
        <h2>Efetua login para poderes aceder à YU.</h2>
        <Link to="/login" className="login-link">
          Ir para a página de login
        </Link>
      </div>
    );
  }

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
    <div className="profile-container mainBody">
      <div className="backgroundDiv"></div>
      <header className="profile-header">
        <h1 className="profile-title">Perfil</h1>
        <span className="gear-icon bi bi-gear" onClick={toggleSettings}></span>
      </header>

      <div className="profile-avatar">
        <img
          src="/assets/YU_cores/YU-roxo.svg"
          alt="Avatar"
          className="avatar-image"
        />
        <h2 className="profile-name">
          {currentUser ? currentUser.username : "Utilizador"}
        </h2>
      </div>

      <div className="profile-buttons">
        <button className="profile-button award">
          <span className="bi bi-bar-chart-line" onClick={toggleGrafico}></span>
        </button>

        <Link to="/informacoes" className="profile-button circle">
          <i className="bi bi-info-circle"></i>
        </Link>

        <button
          className="profile-button dots"
          onClick={handleOpenMessagesModal}
        >
          <i className="bi bi-chat-dots"></i>
        </button>
      </div>

      <Definicoes
        show={showSettings}
        onClose={closeSettings}
        onInfoPessoalClick={handleInfoPessoalClick}
        onArquivoClick={handleArquivoClick}
      />

      <InfoPessoal show={showInfoPessoal} onBack={backToSettings} />

      <Arquivo show={showArquivo} onBack={backToSettings} />

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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Perfil/profile.css";
import Definicoes from "../Definicoes/Definicoes";
import InfoPessoal from "../Definicoes/InfoPessoal";
import Arquivo from "../Definicoes/Arquivo";
import Grafico from "../Grafico/Grafico";
import Messages from "../../Tasks/Messages";
import TopBar from "../../TopBar.js";
import { fetchUsers } from "../../../redux/usersSlice.js";

const Profile = () => {
  const navigate = useNavigate(); // Hook para redirecionar o user
  const loggedInUser = localStorage.getItem("loggedInUser");
  const currentUserId = loggedInUser ? JSON.parse(loggedInUser).id : null;

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [showSettings, setShowSettings] = useState(false);
  const [showInfoPessoal, setShowInfoPessoal] = useState(false);
  const [showArquivo, setShowArquivo] = useState(false);
  const [showGrafico, setShowGrafico] = useState(false);
  // const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  useEffect(() => {
    if (!loggedInUser) {
      // Quando o user não tem login feito
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

  // const handleOpenMessagesModal = () => {
  //   setIsMessagesModalOpen(true);
  // };

  // const handleCloseMessagesModal = () => {
  //   setIsMessagesModalOpen(false);
  // };

  if (!loggedInUser) {
    // mensagem de erro
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

      <TopBar title="Perfil">
        <button aria-label="Abrir definições" onClick={toggleSettings}>
          <ion-icon name="settings-outline" class="icons"></ion-icon>
        </button>
      </TopBar>

      <div className="profile-avatar">
        <img
          src="/assets/YU_cores/YU-roxo.svg"
          alt="O teu Avatar YU"
          className="avatar-image"
        />
        <h2 className="profile-name">
          {currentUser ? currentUser.username : "Utilizador"}
        </h2>
      </div>

      <div className="profile-buttons">
        <button
          aria-label="Botão para abrir gráficos"
          className="profile-button award"
          onClick={toggleGrafico}
        >
          <ion-icon name="podium-outline" class="icons"></ion-icon>
        </button>

        <Link
          aria-label="Link para a página de informações"
          to="/informacoes"
          className="profile-button circle"
        >
          <ion-icon name="information-outline" class="icons"></ion-icon>
        </Link>

        {/* <button
          aria-label="Botão para abrir mensagens"
          className="profile-button dots"
          onClick={handleOpenMessagesModal}
        >
          <ion-icon name="chatbubble-ellipses-outline" class="icons"></ion-icon>
        </button>
      </div>

      <Definicoes
        show={showSettings}
        onClose={closeSettings}
        onInfoPessoalClick={handleInfoPessoalClick}
        onArquivoClick={handleArquivoClick}
        aria-label="Abrir definições"
      />

      <InfoPessoal show={showInfoPessoal} onBack={backToSettings} />

      <Arquivo show={showArquivo} onBack={backToSettings} />

      <Grafico
        show={showGrafico}
        onClose={closeGrafico}
        monthlyData={[5, 10, 15, 20, 25]}
        yearlyData={[100, 200, 300, 400, 500]}
      />

      {/* {isMessagesModalOpen && (
        <Messages
          onClose={handleCloseMessagesModal}
          currentUser={currentUser}
        />
      )} */}
    </div>
  );
};

export default Profile;

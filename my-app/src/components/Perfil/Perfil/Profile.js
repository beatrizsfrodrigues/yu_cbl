// src/components/Perfil/Profile.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Perfil/profile.css";
import Grafico from "../Grafico/Grafico";
import Definicoes from "../Definicoes/Definicoes";
import Acess from "./Acess";
import Informacoes from "../Informacoes/Informacoes";  

import TopBar from "../../TopBar";
import {
  fetchAuthUser,
  fetchOwnedAccessories,
  fetchEquippedAccessories,
} from "../../../redux/usersSlice";
import { fetchAccessories } from "../../../redux/accessoriesSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // estados para controlar cada modal
  const [showGrafico, setShowGrafico] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAcess,    setShowAcess]    = useState(false);
  const [showInfo,    setShowInfo]     = useState(false);   

  const {
    authUser: currentUser,
    status: userStatus,
    error: userError,
    equippedAccessories,
  } = useSelector((state) => state.user);
  const accessories = useSelector((state) => state.accessories.data);

  // fetch inicial
  useEffect(() => {
    dispatch(fetchAuthUser());
    dispatch(fetchOwnedAccessories());
    dispatch(fetchEquippedAccessories());
    dispatch(fetchAccessories());
  }, [dispatch]);


  // lógica para aplicar acessórios ao avatar
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedShirt, setSelectedShirt] = useState(null);
  const [selectedHat, setSelectedHat] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedBigode, setSelectedBigode] = useState(null);
  const [selectedCachecol, setSelectedCachecol] = useState(null);
  const [selectedChapeu, setSelectedChapeu] = useState(null);
  const [selectedOuvidos, setSelectedOuvidos] = useState(null);
  const [selectedOculos, setSelectedOculos] = useState(null);


  useEffect(() => {
    if (!accessories) return;
    const findById = (id) =>
      accessories.find((a) => a && a._id === id) || null;

    setSelectedShirt(findById(equippedAccessories.shirt));
    setSelectedHat(findById(equippedAccessories.hat));
    setSelectedColor(findById(equippedAccessories.color));
    setSelectedBigode(findById(equippedAccessories.bigode));
    setSelectedCachecol(findById(equippedAccessories.cachecol));
    setSelectedChapeu(findById(equippedAccessories.chapeu));
    setSelectedOuvidos(findById(equippedAccessories.ouvidos));
    setSelectedOculos(findById(equippedAccessories.oculos));
  }, [accessories, equippedAccessories]);

  if (userStatus === "loading") return <div>Loading perfil…</div>;
  if (userStatus === "failed")  return <div>Error: {userError}</div>;

  if (!currentUser?._id) {
    navigate("/login");
    return null;
  }

  return (
    <div className="mainBody" id="tasksBody">
      <div className="backgroundDiv" />

      <div className="topbar">
        <TopBar title="Perfil">
          <button
            aria-label="Abrir definições"
            onClick={() => setShowSettings(true)}
          >
            <ion-icon name="settings-outline" class="icons" />
          </button>
        </TopBar>
      </div>

      <div className="profile-avatar">
        <div className="profile-mascotContainer">
          <img
            src={currentUser.mascot}
            alt="Mascote YU"
            className="profile-Yu base"
          />
          {selectedCachecol && (
            <img
              src={selectedCachecol.src}
              alt="Cachecol"
              className="profile-accessory cachecol"
            />
          )}
          {selectedChapeu && (
            <img
              src={selectedChapeu.src}
              alt="Chapéu"
              className="profile-accessory chapeu"
            />
          )}
          {selectedOuvidos && (
            <img
              src={selectedOuvidos.src}
              alt="Ouvidos"
              className="profile-accessory ouvidos"
            />
          )}
          {selectedOculos && (
            <img
              src={selectedOculos.src}
              alt="Óculos"
              className="profile-accessory oculos"
            />
          )}
          {selectedShirt && (
            <img
              src={selectedShirt.src}
              alt="Camisola"
              className="profile-accessory shirt"
            />
          )}
          {selectedBigode && (
            <img
              src={selectedBigode.src}
              alt="Bigode"
              className="profile-accessory bigode"
            />
          )}
          {selectedHat && (
            <img
              src={selectedHat.src}
              alt="Decoração"
              className="profile-accessory hat"
            />
          )}
          {selectedColor && (
            <img
              src={selectedColor.src}
              alt="Cor de pele"
              className="profile-accessory color"
            />
          )}
        </div>
        <h2 className="profile-name">{currentUser.username}</h2>
      </div>

      <div className="profile-buttons">
        {/* Abrir gráfico */}
        <button
          aria-label="Botão para abrir gráficos"
          className="profile-button award"
          onClick={() => setShowGrafico(true)}
        >
          <ion-icon name="podium-outline" className="icons" />
        </button>

        {/* Abrir modal de Informações em vez de link */}
        <button
          aria-label="Informações"
          className="profile-button circle"
          onClick={() => setShowInfo(true)}
        >
          <ion-icon name="information-outline" className="icons" />

        </button>

        {/* Abrir acessibilidade */}
        <button
          aria-label="Acessibilidade"
          className="profile-button circle"
          onClick={() => setShowAcess(true)}
          style={{ backgroundColor: "#8DD4D1" }}
        >
          <ion-icon name="accessibility-outline" className="icons" />
        </button>

      </div>

      {/* Modais */}
      {showGrafico && (
        <Grafico show={showGrafico} onClose={() => setShowGrafico(false)} />
      )}

      {showSettings && (
        <Definicoes
          show={showSettings}
          onClose={() => setShowSettings(false)}
          onInfoPessoalClick={() => navigate("/informacoes-pessoais")}
          onArquivoClick={() => navigate("/arquivo")}
        />
      )}

      {showAcess && (
        <Acess show={showAcess} onClose={() => setShowAcess(false)} />
      )}

     {showInfo && (
        <Informacoes show={showInfo} onClose={() => setShowInfo(false)}/>
)}

      
    </div>
  );
}

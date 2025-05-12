import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Perfil/profile.css";
import InfoPessoal from "../Definicoes/InfoPessoal";
import Arquivo from "../Definicoes/Arquivo";
import Grafico from "../Grafico/Grafico";
import Definicoes from "../Definicoes/Definicoes.js";
import TopBar from "../../TopBar.js";


import {
  fetchAuthUser,
  fetchOwnedAccessories,
  fetchEquippedAccessories,
} from "../../../redux/usersSlice";
import { fetchAccessories } from "../../../redux/accessoriesSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showGrafico, setShowGrafico]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);


  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedShirt,      setSelectedShirt]      = useState(null);
  const [selectedAcc,        setSelectedAcc]        = useState(null);
  const [selectedColor,      setSelectedColor]      = useState(null);

  const {
    authUser:            currentUser,
    status:              userStatus,
    error:               userError,
    ownedAccessories,
    equippedAccessories,
  } = useSelector((state) => state.user);

  const accessories = useSelector((state) => state.accessories.data);


  useEffect(() => {
    dispatch(fetchAuthUser());
    dispatch(fetchOwnedAccessories());
    dispatch(fetchEquippedAccessories());
    dispatch(fetchAccessories());
  }, [dispatch]);


  const findById = (id) =>
    accessories?.find((a) => a && a._id === id) || null;

  useEffect(() => {
    if (!accessories) return;
    setSelectedBackground(findById(equippedAccessories.background));
    setSelectedShirt(     findById(equippedAccessories.shirt));
    setSelectedAcc(       findById(equippedAccessories.hat));
    setSelectedColor(     findById(equippedAccessories.color));
  }, [accessories, equippedAccessories]);


  // Loading / erro
  if (userStatus === "loading") return <div>Loading perfil…</div>;
  if (userStatus === "failed")  return <div>Error: {userError}</div>;

  // Se não estiver logado, redireciona
  if (!currentUser?._id) {
    navigate("/login");
    return null;
  }


  return (
    <div className="profile-container mainBody">
      <div className="backgroundDiv" />

      <TopBar title="Perfil">
        <button
          aria-label="Abrir definições"
          onClick={() => {
            setShowSettings(true);
            navigate("/definicoes");
          }}
        >
          <ion-icon name="settings-outline" className="icons" />
        </button>
      </TopBar>
          {/* Avatar + acessórios */}
<div className="profile-avatar">
  <div className="profile-mascotContainer">
    <img
      src={currentUser.mascot}
      className="profile-Yu"
      alt="Mascote YU"
    />

      {selectedBackground && (
    <img
      src={selectedBackground.src}
      alt=""
      style={{
        position:      "absolute",
        left:          `${selectedBackground.left}px`,
        bottom:        `${selectedBackground.bottom}px`,
        width:         `${selectedBackground.width}px`,
        pointerEvents: "none",
        zIndex:        1
      }}
    />
  )}

  {selectedShirt && (
    <img
      src={selectedShirt.src}
      alt=""
      style={{
        position:      "absolute",
        left:          `${selectedShirt.left}px`,
        bottom:        `${selectedShirt.bottom}px`,
        width:         `${selectedShirt.width}px`,
        pointerEvents: "none",
        zIndex:        2
      }}
    />
  )}

  {selectedAcc && (
    <img
      src={selectedAcc.src}
      alt=""
      style={{
        position:      "absolute",
        left:          `${selectedAcc.left}px`,
        bottom:        `${selectedAcc.bottom}px`,
        width:         `${selectedAcc.width}px`,
        pointerEvents: "none",
        zIndex:        3
      }}
    />
  )}

  {selectedColor && (
    <img
      src={selectedColor.src}
      alt=""
      style={{
        position:      "absolute",
        left:          `${selectedColor.left}px`,
        bottom:        `${selectedColor.bottom}px`,
        width:         `${selectedColor.width}px`,
        pointerEvents: "none",
        zIndex:        4
      }}
    />
  )}
  </div>
  <h2 className="profile-name">{currentUser.username}</h2>
</div>



      <div className="profile-buttons">
        <button
          aria-label="Botão para abrir gráficos"
          className="profile-button award"
          onClick={() => setShowGrafico((v) => !v)}
        >
          <ion-icon name="podium-outline" className="icons" />
        </button>

        <Link
          to="/informacoes"
          className="profile-button circle"
          aria-label="Informações"
        >
          <ion-icon name="information-outline" className="icons" />
        </Link>
      </div>

      {showGrafico && (
        <Grafico
          show={showGrafico}
          onClose={() => setShowGrafico(false)}
          monthlyData={[5, 10, 15, 20, 25]}
          yearlyData={[100, 200, 300, 400, 500]}
        />
      )}

      {showSettings && (
        <Definicoes
          onClose={() => setShowSettings(false)}
          onInfoPessoalClick={() => navigate("/informacoes-pessoais")}
          onArquivoClick={() => navigate("/arquivo")}
        />
      )}
    </div>
  );
}

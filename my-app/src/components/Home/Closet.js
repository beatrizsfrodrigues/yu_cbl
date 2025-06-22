import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { equipAccessories } from "../../redux/usersSlice.js";

const DEFAULT_COLOR_URL =
  "https://res.cloudinary.com/dinzra2oo/image/upload/v1748611193/YU-119_weajgx.svg";


export default function Closet({
  ownedAccessories, // array
  equipped, // { background, shirt, hat, color, bigode, cachecol, chapeu, ouvidos, oculos }
  onPreview, // fn(slot, newId|null) – só PREVIEW
  onSave, // fn()           – executa dispatch de equipAccessories para cada pendingEquip
  closeCloset, // fn()           – fecha sem guardar
}) {
  const [active, setActive] = useState(0);

  const sections = [
    { type: "SkinColor", slot: "color", icon: "color-palette-outline" },
    { type: "Shirts", slot: "shirt", icon: "shirt-outline" },
    { type: "Decor", slot: "hat", icon: "glasses-outline" },
    { type: "Backgrounds", slot: "background", icon: "image-outline" },
  ];

  const dispatch = useDispatch();
  const DECOR_TYPES = [
    "Decor",
    "Bigode",
    "Cachecol",
    "Chapeu",
    "Ouvidos",
    "Oculos",
  ];

  const { type, slot } = sections[active];


  let items = [];
  if (type === "Decor") {
    items = ownedAccessories.filter((i) => DECOR_TYPES.includes(i.type));
  } else if (type === "SkinColor") {
    // injeta a cor default no início da lista para que apareça sempre
    const defaultItem = {
      _id: "defaultColor", // id virtual
      type: "SkinColor",
      name: "Cor padrão",
      src: DEFAULT_COLOR_URL,
      value: 0,
    };
    const colorsOwned = ownedAccessories.filter((i) => i.type === "SkinColor");

    items = [defaultItem, ...colorsOwned];
  } else {
    items = ownedAccessories.filter((i) => i.type === type);
  }

  const typeBySlot = {
    background: "Backgrounds",
    shirt: "Shirts",
    bigode: "Bigode",
    cachecol: "Cachecol",
    chapeu: "Chapeu",
    ouvidos: "Ouvidos",
    oculos: "Oculos",
  };

  const ALL_SLOTS = [
    "background",
    "shirt",
    "bigode",
    "cachecol",
    "chapeu",
    "ouvidos",
    "oculos",
  ];

function unequipAllAndSave() {
 
  ALL_SLOTS.forEach((s) => {
    const t = typeBySlot[s];
    dispatch(equipAccessories({ accessoryId: null, type: t }));
  });

  onPreview("color", null);

  setTimeout(onSave, 50);
}


  return (
    <div className="closetOverlay">
      <div className="closetContainer">
        {/** topo: ícones das secções */}
        <div className="avatareditor">
          <div className="avatarheader">
            {sections.map((sec, idx) => (
              <button
                key={sec.type}
                className={`icons ${active === idx ? "active" : ""}`}
                onClick={() => setActive(idx)}
                aria-label="Mudar secção de acessórios"
              >
                <ion-icon name={sec.icon} class="icons" />
                {active === idx && <span className="dot" />}
              </button>
            ))}
          </div>

          <div className="divider" />

          {items.length === 0 ? (
            <div className="avatarcontentEmpty">
              <p className="empty-category-message">Ainda não tens itens!</p>
            </div>
          ) : (
            <div className="avatarcontent">
              {items.map((it) => {
                // se for Decor, slot é o type em minúsculas; caso contrário, é o slot padrão
                const currSlot = type === "Decor" ? it.type.toLowerCase() : slot;

                // ativo se: (1) item normal e id coincidem OU (2) é cor default e nada equipado
                const isActive =
                  equipped[currSlot] === it._id ||
                  (currSlot === "color" && !equipped[currSlot] && it._id === "defaultColor");

                // id a enviar para preview: para "defaultColor" usamos null
                const nextId = it._id === "defaultColor" ? null : isActive ? null : it._id;

                return (
                  <button
                    key={it._id}
                    className={`avatarcircle ${isActive ? "activeFit" : ""}`}
                    onClick={() => onPreview(currSlot, nextId)}
                  >
                    <img src={it.src} alt={it.name} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/** footer: X, LIXO (desequipar tudo), Guardar */}
        <div className="closetFooter">
          {/* 1. Botão “fechar” (cancela tudo) */}
          <button
            className="profile-button btnHomeActive"
            onClick={closeCloset}
            aria-label="Fechar sem guardar"
          >
            <ion-icon name="close-outline" class="iconswhite" />
          </button>

          {/* 2. Botão “lixo” para desiquipar TUDO e guardar na BD */}
          <button
            className="profile-button btnHomeActive"
            onClick={unequipAllAndSave}
            aria-label="Desequipar todos e guardar"
            style={{ margin: "0 8px" }}
          >
            <ion-icon name="trash-outline" class="iconswhite" />
          </button>

          {/* 3. Botão “Guardar” (aplica apenas o que estiver em pendingEquip) */}
          <button className="buttonMid btnHomeActive" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

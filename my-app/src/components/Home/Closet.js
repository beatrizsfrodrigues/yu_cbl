// src/components/Closet.js
import React, { useState } from "react";

export default function Closet({
  ownedAccessories, // array
  equipped, // { background, shirt, hat, color, bigode, cachecol, chapeu, ouvidos, oculos }
  onPreview, // fn(slot, newId|null) – só PREVIEW
  onSave, // fn()           – faz PUTs
  closeCloset, // fn()           – fecha sem guardar
}) {
  const [active, setActive] = useState(0);

  const sections = [
    { type: "SkinColor", slot: "color", icon: "color-palette-outline" },
    { type: "Shirts", slot: "shirt", icon: "shirt-outline" },
    { type: "Decor", slot: "hat", icon: "glasses-outline" },
    { type: "Backgrounds", slot: "background", icon: "image-outline" },
  ];

  // Estes são os tipos que entram na secção “Decor”
  const DECOR_TYPES = [
    "Decor",
    "Bigode",
    "Cachecol",
    "Chapeu",
    "Ouvidos",
    "Oculos",
  ];

  const { type, slot } = sections[active];

  // filtra items: se Decor, junta todos, senão só aquele tipo
  const items =
    type === "Decor"
      ? ownedAccessories.filter((i) => DECOR_TYPES.includes(i.type))
      : ownedAccessories.filter((i) => i.type === type);

  return (
    <div className="closetOverlay">
      <div className="closetContainer">
        <div className="avatareditor">
          <div className="avatarheader">
            {sections.map((sec, idx) => (
              <button
                key={sec.type}
                className={`icons ${active === idx ? "active" : ""}`}
                onClick={() => setActive(idx)}
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
                // para Decor, usamos o type real; senão, a slot normal
                const currSlot =
                  type === "Decor" ? it.type.toLowerCase() : slot;
                const isActive = equipped[currSlot] === it._id;
                return (
                  <button
                    key={it._id}
                    className={`avatarcircle ${isActive ? "activeFit" : ""}`}
                    onClick={() => {
                      const next = isActive ? null : it._id;
                      onPreview(currSlot, next);
                    }}
                  >
                    <img src={it.src} alt={it.name} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="closetFooter">
          <button
            className="profile-button btnHomeActive"
            onClick={closeCloset}
          >
            <ion-icon name="close-outline" class="iconswhite" />
          </button>

          <button className="buttonMid btnHomeActive" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

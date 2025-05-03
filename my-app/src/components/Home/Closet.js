import React, { useState } from "react";

export default function Closet({
  ownedAccessories,   // array
  equipped,           // { background, shirt, hat, color }  (ids ou null)
  onPreview,          // fn(slot, newId|null) – só PREVIEW
  onSave,             // fn()           – faz PUTs
  closeCloset,        // fn()           – fecha sem guardar
}) {
  const [active, setActive] = useState(0);

  const sections = [
    { type: "SkinColor",  slot: "color",       icon: "color-palette-outline" },
    { type: "Shirts",     slot: "shirt",       icon: "shirt-outline"         },
    { type: "Decor",      slot: "hat",         icon: "glasses-outline"       },
    { type: "Backgrounds",slot: "background",  icon: "image-outline"         },
  ];

  const { type, slot, icon } = sections[active];
  const items = ownedAccessories.filter((i) => i.type === type);

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
                const isActive = equipped[slot] === it._id;
                return (
                  <button
                    key={it._id}
                    className={`avatarcircle ${isActive ? "activeFit" : ""}`}
                    onClick={() => {
                      const next = isActive ? null : it._id;
                      onPreview(slot, next);  
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
          <button className="profile-button btnHomeActive" onClick={closeCloset}>
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

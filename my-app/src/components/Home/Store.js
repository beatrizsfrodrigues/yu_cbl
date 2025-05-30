// src/components/Store.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccessories } from "../../redux/accessoriesSlice.js";

export default function Store({
  addAccessory, // fn(item) para guardar preview no Home
  buyItemBtn, // fn() para disparar a compra
  closeStore, // fn() para fechar a store
  currentUser, // user object (tem .points)
  selectedFit, // item em preview ou null
  resetFit, // fn() limpa o preview
  onShowPopUpInfo, // fn(msg) => void
  dressUp, // fn(item,type) para aplicar preview no avatar
}) {
  const dispatch = useDispatch();
  const accessories = useSelector((s) => s.accessories.data);
  const status = useSelector((s) => s.accessories.status);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (status === "idle") dispatch(fetchAccessories());
  }, [status, dispatch]);

  if (status === "loading") return <div>Loading loja…</div>;

  const sectionsData = [
    {
      type: "SkinColor",
      icon: <ion-icon name="color-palette-outline" class="icons" />,
      items: accessories.filter((i) => i.type === "SkinColor"),
    },
    {
      type: "Shirts",
      icon: <ion-icon name="shirt-outline" class="icons" />,
      items: accessories.filter((i) => i.type === "Shirts"),
    },
    {
      type: "Decor",
      icon: <ion-icon name="glasses-outline" class="icons" />,
      items: accessories.filter((i) =>
        ["Bigode", "Cachecol", "Chapeu", "Ouvidos", "Oculos"].includes(i.type)
      ),
    },

    {
      type: "Backgrounds",
      icon: <ion-icon name="image-outline" class="icons" />,
      items: accessories.filter((i) => i.type === "Backgrounds"),
    },
  ];

  const { items } = sectionsData[activeSection];

  return (
    <div className="storeOverlay">
      <div className="closetContainer">
        <div className="avatareditor">
          {/* Header Icons */}
          <div className="avatarheader">
            {sectionsData.map((sec, idx) => (
              <button
                key={sec.type}
                className={`icons ${activeSection === idx ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(idx);
                  resetFit(); // limpa preview
                }}
              >
                {sec.icon}
                {activeSection === idx && <span className="dot"></span>}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Section Content */}
          <div className="avatarcontent">
            {items.map((item) => (
              <div className="avatarItemDiv" key={item._id}>
                <button
                  className={`avatarcircle ${
                    selectedFit?._id === item._id ? "activeFit" : ""
                  }`}
                  onClick={() => {
                    addAccessory(item); // salva no Home
                    dressUp(item, item.type); // preview no avatar
                  }}
                >
                  <img src={item.src} alt={item.name} />
                </button>
                <p>{item.value} ⭐️</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="closetFooter">
          <button
            className="side-button btnHomeActive"
            onClick={() => {
              resetFit();
              closeStore();
            }}
          >
            <ion-icon name="close-outline" class="iconswhite" />
          </button>

          {selectedFit ? (
            currentUser.points >= selectedFit.value ? (
              <button
                className="buttonMid btnHomeActive"
                onClick={() => {
                  buyItemBtn();
                  resetFit();
                  closeStore();
                }}
              >
                {selectedFit.value}
                <ion-icon name="star-outline" class="iconswhite" />
                Comprar
              </button>
            ) : (
              <button
                className="buttonMid btnHomeActive disabled"
                onClick={() => {
                  onShowPopUpInfo("Estrelas insuficientes!");
                }}
              >
                {selectedFit.value}
                <ion-icon name="star-outline" class="iconswhite" />
                Comprar
              </button>
            )
          ) : (
            <button className="buttonMid">Comprar</button>
          )}

          <button
            className="side-button btnHomeActive"
            onClick={() => {
              resetFit();
              onShowPopUpInfo("Preview resetado");
            }}
          >
            <ion-icon name="refresh-outline" class="iconswhite" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCloset } from "../../redux/closetSlice";

const Closet = ({
  dressUp,
  closeCloset,
  currentMascot,
  selectedBackground,
  selectedShirt,
  selectedAcc,
  selectedColor,
  saveOutfit,
  resetClothes,
  onShowPopUpInfo,
}) => {
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);

  const [activeSection, setActiveSection] = useState(0);

  const ownedItems = closet.filter((item) =>
    currentMascot.accessoriesOwned.includes(item.id)
  );

  useEffect(() => {
    if (closetStatus === "idle") {
      dispatch(fetchCloset());
    }
  }, [closetStatus, dispatch]);

  if (!closet) {
    return <div>Loading...</div>;
  }

  const sectionsData = [
    {
      label: "Skin Color",
      icon: <ion-icon name="color-palette-outline" class="icons"></ion-icon>,
      items: ownedItems.filter((item) => item.type === "SkinColor"),
    },
    {
      label: "Shirts",
      icon: <ion-icon name="shirt-outline" class="icons"></ion-icon>,
      items: ownedItems.filter((item) => item.type === "Shirts"),
    },
    {
      label: "Decor",
      icon: <ion-icon name="glasses-outline" class="icons"></ion-icon>,
      items: ownedItems.filter((item) => item.type === "Decor"),
    },
    {
      label: "Backgrounds",
      icon: <ion-icon name="image-outline" class="icons"></ion-icon>,
      items: ownedItems.filter((item) => item.type === "Backgrounds"),
    },
  ];

  const handleItemClick = (item) => {
    // Verifica se o item já está selecionado
    const isSelected =
      selectedBackground?.id === item.id ||
      selectedShirt?.id === item.id ||
      selectedAcc?.id === item.id ||
      selectedColor?.id === item.id;

    if (isSelected) {
      // Remove o item se já estiver selecionado
      if (item.type === "SkinColor") {
        // Define a cor original ao remover a cor
        dressUp({ type: "SkinColor", src: "/assets/YU_cores/YU-roxo.svg" }); // Substitua 40 pelo ID da cor original
      } else {
        dressUp({ type: item.type, id: null });
      }
    } else {
      // Aplica o item se não estiver selecionado
      dressUp(item);
    }
  };

  return (
    <div className="closetOverlay">
      <div className="closetContainer">
        <div className="avatareditor">
          {/* Header Icons */}
          <div className="avatarheader">
            {sectionsData.map((section, index) => (
              <button
                key={section.label}
                className={`icons ${activeSection === index ? "active" : ""}`}
                onClick={() => setActiveSection(index)}
              >
                {section.icon}
                {activeSection === index && <span className="dot"></span>}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Section Content */}
          <div className="avatarcontent">
            {sectionsData[activeSection].items.map((item) => (
              <button
                key={item.id}
                className={`avatarcircle ${
                  selectedBackground?.id === item.id ||
                  selectedShirt?.id === item.id ||
                  selectedAcc?.id === item.id ||
                  selectedColor?.id === item.id
                    ? "activeFit"
                    : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <img src={item.src} alt={item.name} />
              </button>
            ))}
          </div>
        </div>
        <div className="closetFooter">
          <button
            className="profile-button btnHomeActive"
            onClick={() => {
              closeCloset(); // Apenas fecha o modal
            }}
          >
            <ion-icon name="close-outline" class="iconswhite"></ion-icon>
          </button>
          <button
            className="buttonMid btnHomeActive"
            onClick={() => {
              saveOutfit(); // Salva as alterações
            }}
          >
            Guardar
          </button>
          <button className="profile-button btnHomeActive">
            <ion-icon
              name="refresh-outline"
              onClick={() => resetClothes()}
              class="iconswhite"
            ></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Closet;

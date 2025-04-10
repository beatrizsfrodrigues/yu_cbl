import React, { useEffect, useState } from "react"; // Adicione useState
import { useDispatch, useSelector } from "react-redux";
import { fetchCloset } from "../../redux/closetSlice";
import { buyItem, saveFit } from "../../redux/mascotSlice";

const Store = ({
  addAccessory,
  buyItemBtn,
  closeStore,
  currentUser,
  currentMascot,
  selectedFit,
  resetFit,
  onShowPopUpInfo,
  dressUp,
}) => {
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);

  // Estado para controlar a seção ativa
  const [activeSection, setActiveSection] = useState(0);

  const unownedItems = closet.filter(
    (item) => !currentMascot.accessoriesOwned.includes(item.id)
  );

  useEffect(() => {
    if (closetStatus === "idle") {
      dispatch(fetchCloset());
    }
  }, [closetStatus, dispatch]);

  if (!closet) {
    return <div>Loading...</div>;
  }

  const handleBuyItem = (item) => {
    // Deduz pontos e despacha a ação de compra
    dispatch(buyItem({ itemId: item.id, userId: currentUser.id }));
    dispatch(
      saveFit({
        id: currentMascot.id,
        hat:
          item.type === "Decor"
            ? item.id
            : currentMascot.accessoriesEquipped.hat,
        shirt:
          item.type === "Shirts"
            ? item.id
            : currentMascot.accessoriesEquipped.shirt,
        color:
          item.type === "SkinColor"
            ? item.id
            : currentMascot.accessoriesEquipped.color,
        background:
          item.type === "Backgrounds"
            ? item.id
            : currentMascot.accessoriesEquipped.background,
      })
    );

    buyItemBtn();
    onShowPopUpInfo(
      "Item comprado com sucesso! Acede ao teu armário para ver!"
    );
  };

  const sectionsData = [
    {
      label: "Skin Color",
      icon: <ion-icon name="color-palette-outline" class="icons"></ion-icon>,
      items: unownedItems.filter((item) => item.type === "SkinColor"),
    },
    {
      label: "Shirts",
      icon: <ion-icon name="shirt-outline" class="icons"></ion-icon>,
      items: unownedItems.filter((item) => item.type === "Shirts"),
    },
    {
      label: "Decor",
      icon: <ion-icon name="glasses-outline" class="icons"></ion-icon>,
      items: unownedItems.filter((item) => item.type === "Decor"),
    },
    {
      label: "Backgrounds",
      icon: <ion-icon name="image-outline" class="icons"></ion-icon>,
      items: unownedItems.filter((item) => item.type === "Backgrounds"),
    },
  ];

  return (
    <div className="storeOverlay">
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
              <div className="avatarItemDiv" key={item.id}>
                <button
                  className={`avatarcircle ${
                    selectedFit?.id === item.id ? "activeFit" : ""
                  }`}
                  onClick={() => {
                    addAccessory(item); // Atualiza o item selecionado
                    dressUp(item); // Aplica o item na mascote para visualização
                  }}
                >
                  <img src={item.src} alt={item.name} />
                </button>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="closetFooter">
          <button className="profile-button btnHomeActive" onClick={closeStore}>
            <ion-icon name="close-outline" class="iconswhite"></ion-icon>
          </button>
          {selectedFit && selectedFit !== "" ? (
            currentUser && currentUser.points >= selectedFit.value ? (
              <button
                className="buttonMid btnHomeActive"
                onClick={() => handleBuyItem(selectedFit)}
              >
                {selectedFit.value}
                <ion-icon name="star-outline" class="iconswhite"></ion-icon>
                Comprar
              </button>
            ) : (
              <button className="buttonMid">{selectedFit.value}</button>
            )
          ) : (
            <button className="buttonMid">Comprar</button>
          )}
          <button className="profile-button btnHomeActive">
            <ion-icon
              name="refresh-outline"
              onClick={() => resetFit()}
              class="iconswhite"
            ></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;

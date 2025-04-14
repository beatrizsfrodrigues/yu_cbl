import React, { useEffect, useState } from "react"; // Adicione useState
import { useDispatch, useSelector } from "react-redux";
import { fetchCloset } from "../../redux/closetSlice";
import { buyItem, saveFit } from "../../redux/mascotSlice";
import { buyMultipleItems } from "../../redux/usersSlice";

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

  // Estado para ver os itens selecionados
  const [selectedItems, setSelectedItems] = useState({});


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

  const handleBuyItem = () => {
  Object.values(selectedItems).forEach((item) => {
    dispatch(buyItem({ itemId: item.id, userId: currentUser.id }));
  });

  dispatch(
    buyMultipleItems({
      totalPrice,
      userId: currentUser.id,
    })
  );

  dispatch(
    saveFit({
      id: currentMascot.id,
      hat: selectedItems["Decor"]?.id || currentMascot.accessoriesEquipped.hat,
      shirt: selectedItems["Shirts"]?.id || currentMascot.accessoriesEquipped.shirt,
      color: selectedItems["SkinColor"]?.id || currentMascot.accessoriesEquipped.color,
      background: selectedItems["Backgrounds"]?.id || currentMascot.accessoriesEquipped.background,
    })
  );

  buyItemBtn();
    onShowPopUpInfo("Itens comprados com sucesso! Acede ao teu armário para ver!");
    
    setSelectedItems({});
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

    const totalPrice = Object.values(selectedItems).reduce(
    (acc, item) => acc + (item?.value || 0),
    0
  );


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
                    setSelectedItems((prev) => ({
                      ...prev,
                      [item.type]: item,
                    })); // Atualiza o estado de itens selecionados 
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
          {Object.keys(selectedItems).length > 0 ? (
            currentUser && currentUser.points >= totalPrice ? (
              <button className="buttonMid btnHomeActive" onClick={handleBuyItem}>
                {totalPrice}
                <ion-icon name="star-outline" class="iconswhite"></ion-icon>
                Comprar
              </button>
            ) : (
              <button className="buttonMid">{totalPrice}</button>
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

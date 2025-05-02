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
  selectedItems, // Recebe o estado como prop
  setSelectedItems, // Recebe a função de atualização como prop
}) => {
  // Remova a definição local de selectedItems e setSelectedItems
  // const [selectedItems, setSelectedItems] = useState({});
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);

  // Estado para controlar a seção ativa
  const [activeSection, setActiveSection] = useState(0);

  /*const unownedItems = closet.filter(
    (item) => !currentMascot.accessoriesOwned.includes(item.id)
  );*/

  // Estado para ver a confirmação de saída
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Estado para ver o efeito de flash
  const [isFlashing, setIsFlashing] = useState(false);

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".popup")) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);
    }
  };

  useEffect(() => {
    dispatch(fetchCloset(sectionsData[activeSection].label)); // Busca acessórios da API com base na categoria ativa
  }, [activeSection, dispatch]);

  /*useEffect(() => {
    if (closetStatus === "idle") {
      dispatch(fetchCloset());
    }
  }, [closetStatus, dispatch]);*/

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
        hat:
          selectedItems["Decor"]?.id || currentMascot.accessoriesEquipped.hat,
        shirt:
          selectedItems["Shirts"]?.id ||
          currentMascot.accessoriesEquipped.shirt,
        color:
          selectedItems["SkinColor"]?.id ||
          currentMascot.accessoriesEquipped.color,
        background:
          selectedItems["Backgrounds"]?.id ||
          currentMascot.accessoriesEquipped.background,
      })
    );

    buyItemBtn();
    // onShowPopUpInfo(
    //   "Itens comprados com sucesso! Acede ao teu armário para ver!"
    // );

    setSelectedItems({});
  };

  const sectionsData = [
    {
      label: "SkinColor",
      icon: <ion-icon name="color-palette-outline" class="icons"></ion-icon>,
    },
    {
      label: "Shirts",
      icon: <ion-icon name="shirt-outline" class="icons"></ion-icon>,
    },
    {
      label: "Decor",
      icon: <ion-icon name="glasses-outline" class="icons"></ion-icon>,
    },
    {
      label: "Backgrounds",
      icon: <ion-icon name="image-outline" class="icons"></ion-icon>,
    },
  ];

  /*const sectionsData = [
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
  ];*/

  const totalPrice = Object.values(selectedItems).reduce(
    (acc, item) => acc + (item?.value || 0),
    0
  );

  const handleCloseStore = () => {
    if (Object.keys(selectedItems).length > 0) {
      setShowExitConfirmation(true);
    } else {
      closeStore();
    }
  };

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
          {closet?.length === 0 ? (
            <div className="avatarcontentEmpty">
              <p className="empty-category-message">
                Não há mais itens nesta categoria para comprar!
              </p>
            </div>
          ) : (
            <div className="avatarcontent">
              {closet?.map((item) => (
                <div className="avatarItemDiv" key={item.id}>
                  <button
                    className={`avatarcircle ${
                      selectedItems[item.type]?.id === item.id
                        ? "activeFit"
                        : ""
                    }`}
                    onClick={() => {
                      if (selectedItems[item.type]?.id === item.id) {
                        setSelectedItems((prev) => {
                          const updatedItems = { ...prev };
                          delete updatedItems[item.type];
                          return updatedItems;
                        });
                        dressUp(null, item.type);
                      } else {
                        setSelectedItems((prev) => ({
                          ...prev,
                          [item.type]: item,
                        }));
                        dressUp(item);
                      }
                    }}
                  >
                    <img src={item.src} alt={item.name} />
                  </button>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="closetFooter">
          <button
            className="profile-button btnHomeActive"
            onClick={handleCloseStore}
          >
            <ion-icon name="close-outline" class="iconswhite"></ion-icon>
          </button>
          {Object.keys(selectedItems).length > 0 ? (
            currentUser && currentUser.points >= totalPrice ? (
              <button
                className="buttonMid btnHomeActive"
                onClick={handleBuyItem}
              >
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
          <button className="profile-button btnHomeActive" onClick={resetFit}>
            <ion-icon name="refresh-outline" class="iconswhite"></ion-icon>
          </button>
        </div>
      </div>
      {showExitConfirmation && (
        <div className="popupOverlay" onClick={handleOutsideClick}>
          <div className={`popup ${isFlashing ? "flash" : ""}`}>
            <h2 className="topBar-title">Sair da loja?</h2>
            <p>Tens itens não comprados. De certeza que queres sair?</p>
            <div className="popup-buttons">
              <button
                className="confirmExitBtn"
                onClick={() => {
                  setShowExitConfirmation(false);
                  setSelectedItems({});
                  closeStore();
                }}
              >
                Sair sem comprar
              </button>
              <button
                className="laterLink"
                onClick={() => setShowExitConfirmation(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;

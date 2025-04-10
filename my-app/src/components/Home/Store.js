import React, { useState, useEffect } from "react";
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
}) => {
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);

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

  const handleBuyItem = (item) => {
    // Deduct points and dispatch the buyItem action
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
          <div className="avatarcontent">
            {sectionsData[activeSection].items.map((item) => (
              <div className="avatarItemDiv" key={item.id}>
                <button
                  className={`avatarcircle ${
                    selectedFit.id === item.id ? "activeFit" : ""
                  }`}
                  onClick={() => addAccessory(item)}
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
            <ion-icon name="close-outline" class="iconswhite"></ion-icon>{" "}
          </button>
          {selectedFit && selectedFit !== "" ? (
            currentUser && currentUser.points >= selectedFit.value ? (
              <button
                className="buttonMid btnHomeActive"
                onClick={() => handleBuyItem(selectedFit)} // Updated to call handleBuyItem
              >
                {selectedFit.value}
                <ion-icon name="star-outline" class="iconswhite"></ion-icon>
                Comprar
              </button>
            ) : (
              <button className="buttonMid">
                {selectedFit.value}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8 5H2M5 19H2M3 12H2M15.39 5.21L16.8 8.02999C16.99 8.41999 17.5 8.78999 17.93 8.86999L20.48 9.28999C22.11 9.55999 22.49 10.74 21.32 11.92L19.33 13.91C19 14.24 18.81 14.89 18.92 15.36L19.49 17.82C19.94 19.76 18.9 20.52 17.19 19.5L14.8 18.08C14.37 17.82 13.65 17.82 13.22 18.08L10.83 19.5C9.12 20.51 8.08001 19.76 8.53001 17.82L9.10002 15.36C9.21002 14.9 9.02001 14.25 8.69001 13.91L6.70002 11.92C5.53002 10.75 5.91002 9.56999 7.54002 9.28999L10.09 8.86999C10.52 8.79999 11.03 8.41999 11.22 8.02999L12.63 5.21C13.38 3.68 14.62 3.68 15.39 5.21Z"
                    stroke="#FBFBFB"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
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

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Shirts from "../../assets/imgs/Icons_closet/Shirt.svg";
import Hat from "../../assets/imgs/Icons_closet/TallHat.svg";
import Background from "../../assets/imgs/Icons_closet/Background.svg";
import Circle from "../../assets/imgs/Icons_closet/Circle.svg";
import Reset from "../../assets/imgs/Icons_closet/Reset.svg";
import X from "../../assets/imgs/Icons_closet/Exit.svg";
import { fetchCloset } from "../../redux/closetSlice";
import Star from "../../assets/imgs/Icons_closet/Star.svg";

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
      icon: <img src={Circle} alt="Skin Color" />,
      items: unownedItems.filter((item) => item.type === "SkinColor"),
    },
    {
      label: "Shirts",
      icon: <img src={Shirts} alt="Shirts" />,
      items: unownedItems.filter((item) => item.type === "Shirts"),
    },
    {
      label: "Decor",
      icon: <img src={Hat} alt="Decor" />,
      items: unownedItems.filter((item) => item.type === "Decor"),
    },
    {
      label: "Backgrounds",
      icon: <img src={Background} alt="Backgrounds" />,
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
              <p
                key={section.label}
                className={`icons ${activeSection === index ? "active" : ""}`}
                onClick={() => setActiveSection(index)}
              >
                {section.icon}
                {activeSection === index && <span className="dot"></span>}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Section Content */}
          <div className="avatarcontent">
            {sectionsData[activeSection].items.map((item) => (
              <div
                key={item.id}
                className={`avatarcircle ${
                  selectedFit.id === item.id ? "activeFit" : ""
                }`}
                onClick={() => addAccessory(item)}
              >
                <img src={item.src} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
        <div className="closetFooter">
          <button className="buttonRound btnHomeActive" onClick={closeStore}>
            <img src={X} alt="Exit" />
          </button>
          {selectedFit && selectedFit != "" ? (
            currentUser && currentUser.points >= selectedFit.value ? (
              <button
                className="buttonMid btnHomeActive"
                onClick={() => buyItemBtn()}
              >
                {selectedFit.value}
                <img src={Star} alt="Star" /> Comprar
              </button>
            ) : (
              <button className="buttonMid">
                {selectedFit.value}
                <img src={Star} alt="Star" /> Comprar
              </button>
            )
          ) : (
            <button className="buttonMid">Comprar</button>
          )}
          <button
            className="buttonRound btnHomeActive"
            onClick={() => resetFit()}
          >
            <img src={Reset} alt="Reset" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;

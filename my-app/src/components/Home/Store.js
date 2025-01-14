import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Shirts from "../../assets/imgs/Icons_closet/Shirt.svg";
import Hat from "../../assets/imgs/Icons_closet/TallHat.svg";
import Background from "../../assets/imgs/Icons_closet/Background.svg";
import Circle from "../../assets/imgs/Icons_closet/Circle.svg";
import Reset from "../../assets/imgs/Icons_closet/Reset.svg";
import X from "../../assets/imgs/Icons_closet/Exit.svg";
import { fetchCloset } from "../../redux/closetSlice";
import PopUpInfo from "../Tasks/PopUpInfo.js";

const Store = ({ addAccessory, buyItemBtn, closeStore, resetAccessories, currentUser, currentMascot, selectedFit }) => {
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  
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
      items: closet.filter((item) => item.type === "SkinColor"),
    },
    {
      label: "Shirts",
      icon: <img src={Shirts} alt="Shirts" />,
      items: closet.filter((item) => item.type === "Shirts"),
    },
    {
      label: "Decor",
      icon: <img src={Hat} alt="Decor" />,
      items: closet.filter((item) => item.type === "Decor"),
    },
    {
      label: "Backgrounds",
      icon: <img src={Background} alt="Backgrounds" />,
      items: closet.filter((item) => item.type === "Backgrounds"),
    },
  ];

  //* open and close pop-up info
  const handleBuyItem = () => {
    buyItemBtn();
    setPopUpMessage("Compraste um item!");
    setIsPopUpInfoOpen(true);
  };

  const handleClosePopUpInfo = () => {
    setIsPopUpInfoOpen(false);
  };
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
                  selectedFit === item.id ? "activeFit" : ""
                }`}
                onClick={() => addAccessory(item.src, item.id)}
              >
                <img src={item.src} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
        <div className="closetFooter">
          <button className="buttonRound" onClick={closeStore}>
            <img src={X} alt="Exit" />
          </button>
          <button className="buttonMid" onClick={() => buyItemBtn()}>
            Comprar
          </button>
          <button className="buttonRound" onClick={resetAccessories}>
            <img src={Reset} alt="Reset" />
          </button>
        </div>
      </div>
      {isPopUpInfoOpen && (
        <PopUpInfo message={popUpMessage} onClose={handleClosePopUpInfo} />
      )}
    </div>
  );
};

export default Store;


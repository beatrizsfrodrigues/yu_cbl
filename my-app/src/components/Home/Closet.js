import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Shirts from "../../assets/imgs/Icons_closet/Shirt.svg";
import Hat from "../../assets/imgs/Icons_closet/TallHat.svg";
import Background from "../../assets/imgs/Icons_closet/Background.svg";
import Circle from "../../assets/imgs/Icons_closet/Circle.svg";
import { fetchCloset } from "../../redux/closetSlice";

const Closet = ({ addAccessory, closeCloset, resetAccessories }) => {
  const dispatch = useDispatch();
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);

  const [activeSection, setActiveSection] = useState(0);

  // Fetch closet data
  useEffect(() => {
    if (closetStatus === "idle") {
      dispatch(fetchCloset());
    }
  }, [closetStatus, dispatch]);

  console.log(closet);

  if (!closet) {
    return <div>Loading...</div>;
  }

  // Filter items by type
  const skinColorItems = closet.filter((item) => item.type === "SkinColor");
  const shirtsItems = closet.filter((item) => item.type === "Shirts");
  const decorItems = closet.filter((item) => item.type === "Decor");
  const backgroundsItems = closet.filter((item) => item.type === "Backgrounds");

  const sectionsData = [
    {
      label: "Skin Color",
      icon: <img src={Circle} alt="Skin Color" />,
      items: skinColorItems,
    },
    {
      label: "Shirts",
      icon: <img src={Shirts} alt="Skin Color" />,
      items: shirtsItems,
    },
    {
      label: "Decor",
      icon: <img src={Hat} alt="Skin Color" />,
      items: decorItems,
    },
    {
      label: "Backgrounds",
      icon: <img src={Background} alt="Skin Color" />,
      items: backgroundsItems,
    },
  ];

  return (
    <div className="closetOverlay">
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
                className="avatarcircle"
                onClick={() => {
                  if (addAccessory) addAccessory(item.src);
                }}
              >
                <img src={item.src} alt={item.name} />
                {/* <p>{item.name}</p> */}
              </div>
            ))}
          </div>
        </div>
        <div className="closetFooter">
          <button
            className="avatarcircle colorLight"
            onClick={() => {
              if (resetAccessories) resetAccessories();
            }}
          >
            Reset
          </button>

          <button className="buttonBig" onClick={closeCloset}>
            Save
          </button>

          <button className="avatarcircle colorLight" onClick={closeCloset}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Closet;

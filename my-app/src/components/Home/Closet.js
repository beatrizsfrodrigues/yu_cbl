import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import bigode from "../../assets/imgs/YU_acessorios/YU-bigode.svg";
import chapeucowboy from "../../assets/imgs/YU_acessorios/YU-chapeuCowboy.svg";
import Shirts from "../../assets/imgs/Icons_closet/Shirt.svg";
import Hat from "../../assets/imgs/Icons_closet/TallHat.svg";
import Background from "../../assets/imgs/Icons_closet/Background.svg";
import Circle from "../../assets/imgs/Icons_closet/Circle.svg";

const Closet = ({ addAccessory, closeCloset, resetAccessories }) => {
  const sections = [
    { label: "Skincolor", icon: <img src={Circle} alt="Skin Color" /> },
    { label: "Shirts", icon: <img src={Shirts} alt="Shirts"/> },
    { label: "Decor", icon: <img src={Hat} alt="Decor"/> },
    { label: "Backgrounds", icon: <img src={Background} alt="Background"/> },
  ];

  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="closetOverlay">
      <div className="closetContainer">
        <div className="avatareditor">
          
          {/* Header Icons */}
          
          <div className="avatarheader">
            {sections.map((section, index) => (
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
          <hr className="divider" />

          {/* Content with Accessories */}
          <div className="avatarcontent">
           {activeSection === 0 && (
              <div
                className="avatarcircle"
                onClick={() => {
                  if (addAccessory) addAccessory(chapeucowboy);
                }}
              >
    
              </div>
            )}
            
            {activeSection === 1 && (
              <div
                  className="avatarcircle"
                  onClick={() => {
                    if (addAccessory) addAccessory(chapeucowboy);
                  }}
                >
                  
                </div>
            )}
            

            {activeSection === 2 && (
              <>
                <div
                  className="avatarcircle"
                  onClick={() => {
                    if (addAccessory) addAccessory(chapeucowboy);
                  }}
                >
                  <img src={chapeucowboy} alt="Chapéu Cowboy" />
                </div>

                <div
                  className="avatarcircle"
                  onClick={() => {
                    if (addAccessory) addAccessory(bigode);
                  }}
                >
                  <img src={bigode} alt="Bigode" />
                </div>
              </>
            )}
       </div>
    </div>

          

        {/* Footer with Close, Restart, Save Buttons */}
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


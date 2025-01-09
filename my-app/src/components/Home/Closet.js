import React from "react";
import { Circle } from "react-feather";
import "bootstrap-icons/font/bootstrap-icons.css";
import bigode from "../../assets/imgs/YU_acessorios/YU-bigode.svg";
import chapeucowboy from "../../assets/imgs/YU_acessorios/YU-chapeuCowboy.svg";

const Closet = ({ addAccessory, closeCloset }) => {
  return (
    <div className="closetOverlay">
      <div className="closetContainer">
        <div className="avatareditor">
          {/* Header Icons */}
          <div className="avatarheader">
            <p className="icons">
              <Circle />
            </p>
            <p className="icons">
              <i className="bi bi-backpack"></i> {/* Bag icon */}
            </p>
            <p className="icons">
              <i className="bi bi-smartwatch"></i> {/* Watch icon */}
            </p>
            <p className="icons">
              <i className="bi bi-image-fill"></i> {/* Mountains icon */}
            </p>
          </div>

          {/* Divider */}
          <hr className="divider" />

          {/* Content with Accessories */}
          <div className="avatarcontent">
            <div
              className="avatarcircle"
              onClick={() => {
                if (addAccessory) addAccessory(bigode);
              }}
            >
              <img src={bigode} alt="Bigode" />
            </div>
            <div
              className="avatarcircle"
              onClick={() => {
                if (addAccessory) addAccessory(chapeucowboy);
              }}
            >
              <img src={chapeucowboy} alt="Chapéu Cowboy" />
            </div>
            <div className="avatarcircle "></div>
            <div className="avatarcircle"></div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="closetFooter">
          <button className="avatarcircle colorLight" onClick={closeCloset}>
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

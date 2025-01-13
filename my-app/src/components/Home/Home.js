import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import Store from "./Store";
import Star from "../../assets/imgs/Icons_closet/Star.svg";
import Closeticon from "../../assets/imgs/Icons_closet/Closeticon.svg";
import Storeicon from "../../assets/imgs/Icons_closet/Storeicon.svg";
import "../../assets/css/home.css";

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCloset, setShowCloset] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const dropdownRef = useRef(null);

  const openCloset = () => {
    setShowCloset(true);
    setShowDropdown(false);
  };

  const openStore = () => {
    setShowStore(true);
    setShowDropdown(false);
  };

  const closeCloset = () => setShowCloset(false);
  const closeStore = () => setShowStore(false);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addAccessory = (accessory) => {
    setAccessories((prev) => [...prev, accessory]);
  };

  return (
    <div className="homeContainer">
      <div className={`home mainBody ${showCloset || showStore ? "locked" : ""}`}>
        <div className="row">
          {/* Star Section */}
          <div className="ClassStar">
            <img src={Star} alt="Star" />
            <p>1300</p>
          </div>

          {/* ButtonsCloset Section */}
          <div className="buttonsCloset">
            <div className="closetHeader">
              {/* Closet Icon */}
              <img
                src={Closeticon}
                alt="Closet"
                onClick={openCloset}
                className="closetIcon"
              />
              {/* Chevron Icon */}
              <ChevronDown
                className="navIcon"
                onClick={() => setShowDropdown((prev) => !prev)}
              />
            </div>

            {showDropdown && (
              <div className="dropdown open" ref={dropdownRef}>
                <button onClick={openStore}>
                  <img src={Storeicon} alt="Store" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mascot Section */}
        <div className="mascotContainer">
          <img className="Yu" src={yu} alt="YU logo" />
          {accessories.map((accessory, index) => (
            <img
              key={index}
              className="accessory"
              src={accessory}
              alt={`Accessory ${index}`}
            />
          ))}
        </div>

        {/* Closet Overlay */}
        {showCloset && (
          <div className="closetOverlay">
            <Closet addAccessory={addAccessory} closeCloset={closeCloset} />
          </div>
        )}

        {/* Store Overlay */}
        {showStore && (
          <div className="storeOverlay">
            <Store addAccessory={addAccessory} closeStore={closeStore} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

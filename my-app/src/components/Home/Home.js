import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import Star from "../../assets/imgs/Icons_closet/Star.svg";
import Closeticon from "../../assets/imgs/Icons_closet/Closeticon.svg";
import Storeicon from "../../assets/imgs/Icons_closet/Storeicon.svg";
import "../../assets/css/home.css";

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(true);
  const [showCloset, setShowCloset] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const openCloset = () => {
    //console.log("Opening closet");
    setShowCloset(true);
    setShowDropdown(false);
  };

  const openStore = () => {
    //console.log("Navigating to store");
    setShowDropdown(true);
    navigate("/store");
  };

  const closeCloset = () => setShowCloset(false);

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
      <div className={`home mainBody ${showCloset ? "locked" : ""}`}>
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
                onClick={openCloset} // Directly call openCloset
                className="closetIcon"
              />
              {/* Chevron Icon */}
             <ChevronDown
                className="navIcon"
                onClick={() => {
                  setShowDropdown((prev) => {
                    console.log('Previous state:', prev); // Log the previous state
                    const newState = !prev;
                    console.log('New state:', newState); // Log the new state
                    return newState;
                  });
                }}
              />
                {/*{console.log('showDropdown:', showDropdown)}*/}

                {console.log("Rendering JSX", showDropdown)}

              {showDropdown && (
                <div className={`dropdown ${showDropdown ? 'open' : ''}`} ref={dropdownRef}>
                  <button onClick={openStore}>
                    <img src={Storeicon} alt="Store" />
                  </button>
                </div>
              )}
            </div>
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

        {showCloset && (
          <div className="closetOverlay">
            <Closet addAccessory={addAccessory} closeCloset={closeCloset} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
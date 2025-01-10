import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import Star from "../../assets/imgs/Icons_closet/Star.svg";
import Closeticon from "../../assets/imgs/Icons_closet/Closeticon.svg";
import Store from "../../assets/imgs/Icons_closet/Store.svg";
import "../../assets/css/home.css";


const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [showCloset, setShowCloset] = useState(false); // Controls Closet overlay visibility
  const [accessories, setAccessories] = useState([]); // Tracks selected accessories
  const dropdownRef = useRef(null); // Dropdown reference

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const openCloset = () => {
    setShowDropdown(false); // Close dropdown
    setShowCloset(true); // Show Closet overlay
  };

  const closeCloset = () => {
    setShowCloset(false); // Hide Closet overlay
  };

  const resetAccessories = () => {
  setAccessories([]); // Clear all accessories
};


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false); // Close dropdown if click is outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Listen for outside click

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up the event listener
    };
  }, []);

  const addAccessory = (accessory) => {
    setAccessories((prev) => [...prev, accessory]); // Add selected accessory
  };

  return (
    // <div className="homeContainer">
    <div className={`home mainBody ${showCloset ? "locked" : ""}`}>
      <div className="row">
        <div className="buttonsHome">
          <img src={Star} alt="Star" />
          <p>1300</p>
        </div>

        <div className="buttonsCloset">

          <image src={Closeticon} alt="Closet" />

          <ChevronDown className="navIcon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={openCloset}>Open Closet</button>
              <button>
                <image src={Store} alt="Store" />
              </button>
            </div>
          )}
        </div>
      </div>

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
          <Closet addAccessory={addAccessory} 
          closeCloset={closeCloset}
          resetAccessories={resetAccessories} />
        </div>
      )}
    </div>
    // </div>
  );
};

export default Home;
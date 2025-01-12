import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import Star from "../../assets/imgs/Icons_closet/Star.svg";
import "../../assets/css/home.css";

const Home = () => {
  {/*   O que estava antes
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

  */}
   
   {/*  Parte Nova */}
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [selectedIcon, setSelectedIcon] = useState("bi bi-door-open"); // Tracks selected icon
  const dropdownRef = useRef(null); // Dropdown reference
  const [showCloset, setShowCloset] = useState(false); // Controls Closet overlay visibility
  const [accessories, setAccessories] = useState([]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };
  const selectCloset = () => {
    setSelectedIcon("bi bi-door-open"); // Set closet icon
    setShowDropdown(false); // Close dropdown
    setShowCloset(true);
  };

  const selectShop = () => {
    setSelectedIcon("bi bi-bag"); // Set shop icon
    setShowDropdown(false); // Close dropdown
    setShowCloset(false);
  };

  const openCloset = () => {
    setShowDropdown(false); // Close dropdown
    setShowCloset(true); // Show Closet overlay
  };

  const closeCloset = () => {
    setShowCloset(false); // Hide Closet overlay
  };
  
   {/* ........ */}
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
        {/** */}
        <i
            stroke="#B49BC7"
            className={`${selectedIcon} button-rounded`}
            onClick={toggleDropdown}
          ></i>
          <ChevronDown className="navIcon button-rounded" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="dropdown-menu dropdown-styled" ref={dropdownRef}>
              <button className="dropdown-item" onClick={selectCloset}>
                <i className="bi bi-door-open"></i> Closet
              </button>
              <button className="dropdown-item" onClick={selectShop}>
                <i className="bi bi-bag"></i> Shop
              </button>
            </div>
          )}
        </div>
         {/** */}
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

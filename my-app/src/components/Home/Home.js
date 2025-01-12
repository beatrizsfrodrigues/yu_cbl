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

  
   {/* ........ */}
  
  const resetAccessories = () => {
  setAccessories([]); // Clear all accessories
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

         {/** */}
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
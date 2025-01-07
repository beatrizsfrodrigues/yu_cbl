import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import "../../assets/css/home.css";


const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [clickCount, setClickCount] = useState(0); // Track number of clicks
  const [showCloset, setShowCloset] = useState(false); // Controls Closet component visibility
  const navigate = useNavigate(); // Navigation hook
  const dropdownRef = useRef(null); // Dropdown reference

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility

    if (clickCount === 1) {
      // Trigger Closet navigation on second click
      setShowCloset(true);
      navigate("/Closet"); // Navigate to Closet page
    }

    setClickCount(prevCount => prevCount + 1); // Increment click count
  };

  const goToStore = () => {
    setShowDropdown(false); // Close dropdown
    setClickCount(0); // Reset click count
    navigate("/Store"); // Navigate to the store page
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false); // Close dropdown if click is outside
      setClickCount(0); // Reset click count
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Listen for outside click

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up the event listener
    };
  }, []);

  return (
  <div className="homeContainer">
    <div className={`home mainBody ${showCloset ? 'locked' : ''}`}>
      <div className="row">
        <div className="buttonsHome">
          <svg className="star" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5 5H2.5M5.5 19H2.5M3.5 12H2.5M15.89 5.21L17.3 8.02999C17.49 8.41999 18 8.78999 18.43 8.86999L20.98 9.28999C22.61 9.55999 22.99 10.74 21.82 11.92L19.83 13.91C19.5 14.24 19.31 14.89 19.42 15.36L19.99 17.82C20.44 19.76 19.4 20.52 17.69 19.5L15.3 18.08C14.87 17.82 14.15 17.82 13.72 18.08L11.33 19.5C9.62 20.51 8.58001 19.76 9.03001 17.82L9.60002 15.36C9.71002 14.9 9.52001 14.25 9.19001 13.91L7.20002 11.92C6.03002 10.75 6.41002 9.56999 8.04002 9.28999L10.59 8.86999C11.02 8.79999 11.53 8.41999 11.72 8.02999L13.13 5.21C13.88 3.68 15.12 3.68 15.89 5.21Z"
              stroke="#B49BC7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 5H2.5M5.5 19H2.5M3.5 12H2.5M15.89 5.21L17.3 8.02999C17.49 8.41999 18 8.78999 18.43 8.86999L20.98 9.28999C22.61 9.55999 22.99 10.74 21.82 11.92L19.83 13.91C19.5 14.24 19.31 14.89 19.42 15.36L19.99 17.82C20.44 19.76 19.4 20.52 17.69 19.5L15.3 18.08C14.87 17.82 14.15 17.82 13.72 18.08L11.33 19.5C9.62 20.51 8.58001 19.76 9.03001 17.82L9.60002 15.36C9.71002 14.9 9.52001 14.25 9.19001 13.91L7.20002 11.92C6.03002 10.75 6.41002 9.56999 8.04002 9.28999L10.59 8.86999C11.02 8.79999 11.53 8.41999 11.72 8.02999L13.13 5.21C13.88 3.68 15.12 3.68 15.89 5.21Z"
              stroke="black"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>1300</p>
        </div>

        <div className="buttonsCloset">
          <i stroke="#B49BC7" className="bi bi-door-open" onClick={toggleDropdown}></i>
          <ChevronDown className="navIcon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={toggleDropdown}>Open Closet</button>
              <button onClick={goToStore}> <i className="bi bi-store"></i> </button>
            </div>
          )}
        </div>
      </div>
      <img className="Yu" src={yu} alt="YU logo" />
      {showCloset && <Closet />}
    </div>
  </div>
  );
};

export default Home;
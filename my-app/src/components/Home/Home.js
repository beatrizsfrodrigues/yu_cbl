import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, buyAcc } from "../../redux/usersSlice.js";
import { fetchMascot, buyItem } from "../../redux/mascotSlice.js";
import { fetchCloset } from "../../redux/closetSlice";
import { ChevronDown } from "react-feather";
import yu from "../../assets/imgs/YU_cores/YU-roxo.svg";
import Closet from "./Closet";
import Store from "./Store";
import Star from "../../assets/imgs/Icons_closet/Star.svg";
import Closeticon from "../../assets/imgs/Icons_closet/Closeticon.svg";
import Storeicon from "../../assets/imgs/Icons_closet/Storeicon.svg";
import "../../assets/css/home.css";

const Home = () => {
  const dispatch = useDispatch();
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const mascots = useSelector((state) => state.mascot.data);
  const mascotsStatus = useSelector((state) => state.mascot.status);
  const closet = useSelector((state) => state.closet.data);
  const closetStatus = useSelector((state) => state.closet.status);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCloset, setShowCloset] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMascot, setCurrentMascot] = useState(null);
  const [selectedFit, setSelectedFit] = useState("porConcluir");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  useEffect(() => {
    if (mascotsStatus === "idle") {
      dispatch(fetchMascot());
    }
  }, [mascotsStatus, dispatch]);

  useEffect(() => {
    if (closetStatus === "idle") {
      dispatch(fetchCloset());
    }
  }, [closetStatus, dispatch]);

  useEffect(() => {
    const user =
      users && users.length > 0
        ? users.find((user) => user.id == currentUserId)
        : null;
    setCurrentUser(user);
  }, [users, currentUserId]);

  useEffect(() => {
    const mascot =
    mascots && mascots.length > 0
    ? mascots.find((mascot) => mascot.userId == currentUserId)
    : null;
    setCurrentMascot(mascot);
  }, [mascots, currentUserId]);

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

  const addAccessory = (accessory, id) => {
    console.log(id);
  setSelectedFit(id);
  
    setAccessories((prev) => [...prev, accessory]);
  };

  const buyItemBtn = ()=>{
    dispatch(buyItem({ itemId: selectedFit, userId: currentUserId }));
  const item = closet.find(item => item.id === selectedFit);
  if (item) {
    dispatch(buyAcc({ price: item.value, userId: currentUserId }));
  }
  }

  return (
    <div className="homeContainer">
      {currentUser && (<div className={`home mainBody ${showCloset || showStore ? "locked" : ""}`}>
        <div className="row">
          {/* Star Section */}
          <div className="ClassStar">
            <img src={Star} alt="Star" />
            <p>{currentUser.points}</p>
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
            <Closet addAccessory={addAccessory} closeCloset={closeCloset} currentMascot={currentMascot}/>
          </div>
        )}

        {/* Store Overlay */}
        {showStore && (
          <div className="storeOverlay">
            <Store addAccessory={addAccessory} closeStore={closeStore} currentUser={currentUser} currentMascot={currentMascot} selectedFit={selectedFit} buyItemBtn={buyItemBtn} />
          </div>
        )}
      </div>)}
    </div>
  );
};

export default Home;
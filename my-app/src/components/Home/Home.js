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
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMascot, setCurrentMascot] = useState(null);
  //& things to buy
  const [selectedFit, setSelectedFit] = useState("");

  //& things in your closet to wear
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedShirt, setSelectedShirt] = useState("");
  const [selectedAcc, setSelectedAcc] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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

  const closeCloset = () => {
    setSelectedFit("");
    setShowCloset(false);
  };
  const closeStore = () => {
    setSelectedFit("");
    setShowStore(false);
  };

  const addAccessory = (item) => {
    setSelectedFit(item);
  };

  const dressUp = (item) => {
    console.log(item.type);
    if (item.type == "Backgrounds") {
      setSelectedBackground(item);
    } else if (item.type == "Shirts") {
      setSelectedShirt(item);
    } else if (item.type == "Decor") {
      setSelectedAcc(item);
    } else if (item.type == "SkinColor") {
      setSelectedColor(item);
    }
  };

  const buyItemBtn = () => {
    dispatch(buyItem({ itemId: selectedFit.id, userId: currentUserId }));

    dispatch(buyAcc({ price: selectedFit.value, userId: currentUserId }));
  };

  const resetFit = () => {
    setSelectedFit("");
  };

  return (
    <div className="homeContainer">
      {selectedBackground ? (
        <div
          style={{
            backgroundImage: `url(${selectedBackground.src})`,
          }}
          id="backgroundDiv"
        ></div>
      ) : (
        currentMascot.accessoriesEquipped.background && (
          <div
            style={{
              backgroundImage: `url(${
                closet.find(
                  (item) =>
                    item.id == currentMascot.accessoriesEquipped.background
                )?.src
              })`,
            }}
            id="backgroundDiv"
          ></div>
        )
      )}
      {currentUser && (
        <div
          className={`home mainBody ${showCloset || showStore ? "locked" : ""}`}
        >
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
            {/*dress up yu color  */}
            {selectedColor ? (
              <img className="Yu" src={selectedColor.src} alt="YU" />
            ) : (
              <img
                className="Yu"
                src={
                  closet.find(
                    (item) => item.id == currentMascot.accessoriesEquipped.color
                  )?.src
                }
                alt="YU logo"
              />
            )}

            {/*dress up yu shirt  */}
            {selectedShirt ? (
              <img
                className="accessory"
                alt={selectedShirt.name}
                style={{
                  width: selectedShirt.width,
                  left: selectedShirt.left,
                  bottom: selectedShirt.bottom,
                  position: "absolute",
                }}
                src={selectedShirt.src}
              />
            ) : (
              currentMascot.accessoriesEquipped.shirt && (
                <img
                  className="accessory"
                  alt={
                    closet.find(
                      (item) =>
                        item.id == currentMascot.accessoriesEquipped.shirt
                    )?.name
                  }
                  style={{
                    width: closet.find(
                      (item) =>
                        item.id == currentMascot.accessoriesEquipped.shirt
                    )?.width,
                    left: closet.find(
                      (item) =>
                        item.id == currentMascot.accessoriesEquipped.shirt
                    )?.left,
                    bottom: closet.find(
                      (item) =>
                        item.id == currentMascot.accessoriesEquipped.shirt
                    )?.bottom,
                    position: "absolute",
                  }}
                  src={
                    closet.find(
                      (item) =>
                        item.id == currentMascot.accessoriesEquipped.shirt
                    )?.src
                  }
                />
              )
            )}

            {/*dress up yu accessories  */}
            {selectedAcc ? (
              <img
                className="accessory"
                alt={selectedAcc.name}
                style={{
                  width: selectedAcc.width,
                  left: selectedAcc.left,
                  bottom: selectedAcc.bottom,
                  position: "absolute",
                }}
                src={selectedAcc.src}
              />
            ) : (
              currentMascot.accessoriesEquipped.hat && (
                <img
                  className="accessory"
                  alt={
                    closet.find(
                      (item) => item.id == currentMascot.accessoriesEquipped.hat
                    )?.name
                  }
                  style={{
                    width: closet.find(
                      (item) => item.id == currentMascot.accessoriesEquipped.hat
                    )?.width,
                    left: closet.find(
                      (item) => item.id == currentMascot.accessoriesEquipped.hat
                    )?.left,
                    bottom: closet.find(
                      (item) => item.id == currentMascot.accessoriesEquipped.hat
                    )?.bottom,
                    position: "absolute",
                  }}
                  src={
                    closet.find(
                      (item) => item.id == currentMascot.accessoriesEquipped.hat
                    )?.src
                  }
                />
              )
            )}

            {selectedFit && (
              <img
                className="accessory"
                alt={selectedFit.name}
                style={{
                  width: selectedFit.width,
                  left: selectedFit.left,
                  bottom: selectedFit.bottom,
                  position: "absolute",
                }}
                src={selectedFit.src}
              />
            )}
          </div>

          {/* Closet Overlay */}
          {showCloset && (
            <div className="closetOverlay">
              <Closet
                dressUp={dressUp}
                closeCloset={closeCloset}
                currentMascot={currentMascot}
                selectedBackground={selectedBackground}
                selectedShirt={selectedShirt}
                selectedAcc={selectedAcc}
                selectedColor={selectedColor}
              />
            </div>
          )}

          {/* Store Overlay */}
          {showStore && (
            <div className="storeOverlay">
              <Store
                addAccessory={addAccessory}
                closeStore={closeStore}
                currentUser={currentUser}
                currentMascot={currentMascot}
                selectedFit={selectedFit}
                buyItemBtn={buyItemBtn}
                resetFit={resetFit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

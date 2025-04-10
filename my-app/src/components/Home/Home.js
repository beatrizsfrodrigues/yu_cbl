import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, buyAcc } from "../../redux/usersSlice.js";
import { fetchMascot, buyItem, saveFit } from "../../redux/mascotSlice.js";
import { fetchCloset } from "../../redux/closetSlice";
import PopUpInfo from "../PopUpInfo.js";
import Closet from "./Closet";
import Store from "./Store";
import TopBar from "../TopBar";
import "../../assets/css/home.css";

const Home = () => {
  const dispatch = useDispatch();
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const users = useSelector((state) => state.users.data);
  //const usersStatus = useSelector((state) => state.users.status);
  const mascots = useSelector((state) => state.mascot.data);
  //const mascotsStatus = useSelector((state) => state.mascot.status);
  const closet = useSelector((state) => state.closet.data);
  //const closetStatus = useSelector((state) => state.closet.status);
  const [showCloset, setShowCloset] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMascot, setCurrentMascot] = useState(null);
  const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  //& things to buy
  const [selectedFit, setSelectedFit] = useState("");

  //& things in your closet to wear
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedShirt, setSelectedShirt] = useState("");
  const [selectedAcc, setSelectedAcc] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUsers());
      await dispatch(fetchMascot());
      await dispatch(fetchCloset());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    console.log("Users:", users);
    console.log("Current User ID:", currentUserId);
    const user =
      users && users.length > 0
        ? users.find((user) => user.id === currentUserId)
        : null;
    console.log("Current User:", user);
    setCurrentUser(user);
  }, [users, currentUserId]);

  useEffect(() => {
    if (mascots && mascots.length > 0) {
      const mascot = mascots.find((mascot) => mascot.userId === currentUserId);
      setCurrentMascot(mascot);
      console.log("Current Mascot:", mascot);
    }
  }, [mascots, currentUserId]);

  //* open and close pop-up info
  const handleClosePopUpInfo = () => {
    setIsPopUpInfoOpen(false);
  };

  const handleShowPopUpInfo = (message) => {
    setPopUpMessage(message);
    setIsPopUpInfoOpen(true);
  };

  const openCloset = () => {
    setSelectedBackground(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.background
      ) || ""
    );
    setSelectedShirt(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.shirt
      ) || ""
    );
    setSelectedAcc(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.hat
      ) || ""
    );
    setSelectedColor(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.color
      ) || ""
    );
    setShowCloset(true);
  };

  const openStore = () => {
    setShowStore(true);
    setShowCloset(false);
  };

  if (!currentUser || !currentMascot || !closet) {
    return <div>Loading...</div>;
  }

  const closeCloset = () => {
    setSelectedBackground("");
    setSelectedShirt("");
    setSelectedAcc("");
    setSelectedColor("");
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
    if (item.type === "Backgrounds") {
      setSelectedBackground(item);
    } else if (item.type === "Shirts") {
      setSelectedShirt(item);
    } else if (item.type === "Decor") {
      setSelectedAcc(item);
    } else if (item.type === "SkinColor") {
      setSelectedColor(item);
    }
  };

  const buyItemBtn = () => {
    dispatch(buyItem({ itemId: selectedFit.id, userId: currentUserId }));

    dispatch(buyAcc({ price: selectedFit.value, userId: currentUserId }));

    setSelectedFit("");

    handleShowPopUpInfo(
      "Item comprado com sucesso! Acede ao teu armário para ver!"
    );
  };

  const resetFit = () => {
    setSelectedFit("");
  };

  const resetClothes = () => {
    setSelectedBackground("");
    setSelectedShirt("");
    setSelectedAcc("");
    setSelectedColor("");
  };

  const saveOutfit = () => {
    dispatch(
      saveFit({
        hat: selectedAcc?.id || currentMascot.accessoriesEquipped.hat || null,
        shirt:
          selectedShirt?.id || currentMascot.accessoriesEquipped.shirt || null,
        color:
          selectedColor?.id || currentMascot.accessoriesEquipped.color || 40,
        background:
          selectedBackground?.id ||
          currentMascot.accessoriesEquipped.background ||
          null,
        id: currentMascot.id,
      })
    );

    handleShowPopUpInfo("Alterações guardadas com sucesso!");
  };

  const formatPoints = (points) => {
    if (points >= 10_000_000) {
      return (points / 1_000_000).toFixed(1).replace(".0", "") + "M+";
    } else if (points >= 10_000) {
      return (points / 1_000).toFixed(1).replace(".0", "") + "K+";
    }
    return points;
  };

  return (
    <div className="homeContainer">
      <div className="backgroundDiv"></div>
      {currentUser && currentMascot && (
        <div
          style={{
            backgroundImage: selectedBackground
              ? `url(${selectedBackground.src})`
              : selectedFit && selectedFit.type === "Backgrounds"
              ? `url(${selectedFit.src})`
              : currentMascot.accessoriesEquipped.background
              ? `url(${
                  closet.find(
                    (item) =>
                      item.id === currentMascot.accessoriesEquipped.background
                  )?.src
                })`
              : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          id="backgroundDiv"
        ></div>
      )}
      {currentUser && currentMascot && (
        <div
          className={`home mainBody ${showCloset || showStore ? "locked" : ""}`}
        >
          <div className="home mainBody">
            <TopBar>
              <div className="ClassStar">
                <ion-icon name="star-outline" class="icons"></ion-icon>
                <p>{formatPoints(currentUser.points)}</p>
              </div>
              <div className="buttonsCloset">
                <button
                  className="btnHomeHeader"
                  aria-label="armario"
                  onClick={openCloset}
                >
                  <ion-icon name="brush-outline" class="icons"></ion-icon>
                </button>
                <button
                  className="btnHomeHeader"
                  aria-label="loja"
                  onClick={openStore}
                >
                  <ion-icon name="bag-outline" class="icons"></ion-icon>
                </button>
              </div>
            </TopBar>
          </div>
          {/* Mascot Section */}
          <div
            className={`mascotContainer ${
              showCloset || showStore ? "moveUp" : ""
            }`}
          >
            {/*dress up yu color  */}
            {selectedColor ? (
              <img className={`Yu `} src={selectedColor.src} alt="YU" />
            ) : selectedFit && selectedFit.type === "SkinColor" ? (
              <img className={`Yu `} src={selectedFit.src} alt="YU" />
            ) : (
              <img
                className={`Yu `}
                src={
                  closet.find(
                    (item) =>
                      item.id === currentMascot.accessoriesEquipped.color
                  )?.src
                }
                alt="Imagem da tua mascote YU"
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
            ) : selectedFit && selectedFit.type === "Shirts" ? (
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
            ) : (
              currentMascot.accessoriesEquipped.shirt && (
                <img
                  className="accessory"
                  alt={
                    closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.shirt
                    )?.name
                  }
                  style={{
                    width: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.shirt
                    )?.width,
                    left: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.shirt
                    )?.left,
                    bottom: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.shirt
                    )?.bottom,
                    position: "absolute",
                  }}
                  src={
                    closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.shirt
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
            ) : selectedFit && selectedFit.type === "Decor" ? (
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
            ) : (
              currentMascot.accessoriesEquipped.hat && (
                <img
                  className="accessory"
                  alt={
                    closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.hat
                    )?.name
                  }
                  style={{
                    width: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.hat
                    )?.width,
                    left: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.hat
                    )?.left,
                    bottom: closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.hat
                    )?.bottom,
                    position: "absolute",
                  }}
                  src={
                    closet.find(
                      (item) =>
                        item.id === currentMascot.accessoriesEquipped.hat
                    )?.src
                  }
                />
              )
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
                saveOutfit={saveOutfit}
                resetClothes={resetClothes}
                onShowPopUpInfo={handleShowPopUpInfo}
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
                onShowPopUpInfo={handleShowPopUpInfo}
              />
            </div>
          )}
        </div>
      )}
      {isPopUpInfoOpen && (
        <PopUpInfo onClose={handleClosePopUpInfo} message={popUpMessage} />
      )}
    </div>
  );
};

export default Home;

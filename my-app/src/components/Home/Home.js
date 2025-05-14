import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/usersSlice.js";
import { getAuthUser } from "../../utils/cookieUtils";
import { fetchMascot, buyItem, saveFit } from "../../redux/mascotSlice.js";
import { fetchCloset } from "../../redux/closetSlice";
import PopUpInfo from "../PopUpInfo.js";
import Closet from "./Closet";
import Store from "./Store";
import TopBar from "../TopBar";
import "../../assets/css/home.css";

const Home = () => {
  const dispatch = useDispatch();
  const authUser = getAuthUser();
  const currentUserId = authUser?.id;
  console.log('🟢 Cookie completo:', document.cookie);
  console.log('🟢 getAuthUser():', authUser);

  const users = useSelector((state) => state.users.data);
  //const usersStatus = useSelector((state) => state.users.status);
  const mascots = useSelector((state) => state.mascot.data);
  //const mascotsStatus = useSelector((state) => state.mascot.status);
  const closet = useSelector((state) => state.closet.data);
  //const closetStatus = useSelector((state) => state.closet.status);
  const [isClosetOpen, setIsClosetOpen] = useState(false);
  const [showCloset, setShowCloset] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMascot, setCurrentMascot] = useState(null);
  const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  //& things to buy
  const [selectedFit, setSelectedFit] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

  //& things in your closet to wear
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedShirt, setSelectedShirt] = useState("");
  const [selectedAcc, setSelectedAcc] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [originalBackground, setOriginalBackground] = useState(null);
  const [originalShirt, setOriginalShirt] = useState(null);
  const [originalAcc, setOriginalAcc] = useState(null);
  const [originalColor, setOriginalColor] = useState(null);

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
    // Salva os valores originais
    setOriginalBackground(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.background
      ) || null
    );
    setOriginalShirt(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.shirt
      ) || null
    );
    setOriginalAcc(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.hat
      ) || null
    );
    setOriginalColor(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.color
      ) || { src: "/assets/YU_cores/YU-roxo.svg" } // Cor padrão
    );

    // Inicializa os estados locais
    setSelectedBackground(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.background
      ) || null
    );
    setSelectedShirt(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.shirt
      ) || null
    );
    setSelectedAcc(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.hat
      ) || null
    );
    setSelectedColor(
      closet.find(
        (item) => item.id === currentMascot.accessoriesEquipped.color
      ) || { src: "/assets/YU_cores/YU-roxo.svg" } // Cor padrão
    );

    setShowCloset(true); // Abre o closet
  };

  const openStore = () => {
    setOriginalBackground(selectedBackground);
    setOriginalShirt(selectedShirt);
    setOriginalAcc(selectedAcc);
    setOriginalColor(selectedColor);

    setShowStore(true);
  };

  if (!currentUser || !currentMascot || !closet) {
    return <div>Loading...</div>;
  }

  const closeCloset = () => {
    // Restaura os valores originais
    setSelectedBackground(originalBackground);
    setSelectedShirt(originalShirt);
    setSelectedAcc(originalAcc);
    setSelectedColor(originalColor);

    // Atualiza o estado da mascote para refletir os valores originais
    setCurrentMascot((prevMascot) => ({
      ...prevMascot,
      accessoriesEquipped: {
        hat: originalAcc?.id || null,
        shirt: originalShirt?.id || null,
        color: originalColor?.id || "/assets/YU_cores/YU-roxo.svg",
        background: originalBackground?.id || null,
      },
    }));

    setShowCloset(false);
    setIsClosetOpen(false); // Fecha o closet
  };

  const closeStore = () => {
    setSelectedItems({}); // Limpa os itens selecionados
    dressUp(null, "all"); // Remove todos os itens temporários da mascote
    setShowStore(false);
  };

  const addAccessory = (item) => {
    if (selectedItems[item.type]?.id === item.id) {
      // Se o item já estiver selecionado, remove-o
      setSelectedItems((prev) => {
        const updatedItems = { ...prev };
        delete updatedItems[item.type];
        return updatedItems;
      });
      dressUp(null, item.type); // Remove o item da mascote
    } else {
      // Caso contrário, adiciona o item
      setSelectedItems((prev) => ({
        ...prev,
        [item.type]: item,
      }));
      dressUp(item); // Aplica o item na mascote
    }
  };

  const dressUp = (item, type) => {
    if (!item) {
      // Remove o item da mascote com base no tipo
      if (type === "Backgrounds") {
        setSelectedBackground(null);
      } else if (type === "Shirts") {
        setSelectedShirt(null);
      } else if (type === "Decor") {
        setSelectedAcc(null);
      } else if (type === "SkinColor") {
        setSelectedColor(null);
      } else if (type === "all") {
        // Remove todos os itens
        setSelectedBackground(null);
        setSelectedShirt(null);
        setSelectedAcc(null);
        setSelectedColor(null);
      }
    } else {
      // Aplica o item na mascote
      if (item.type === "Backgrounds") {
        setSelectedBackground(item);
      } else if (item.type === "Shirts") {
        setSelectedShirt(item);
      } else if (item.type === "Decor") {
        setSelectedAcc(item);
      } else if (item.type === "SkinColor") {
        setSelectedColor(item);
      }
    }
  };

  const buyItemBtn = () => {
    dispatch(buyItem({ itemId: selectedFit.id, userId: currentUserId }));

    setSelectedFit("");

    // Use a função já definida
    handleShowPopUpInfo("Item comprado com sucesso!");
  };

  const resetFit = () => {
    setSelectedItems({}); // Limpa os itens selecionados
    dressUp(null, "all"); // Remove todos os itens da mascote
  };

  const resetClothes = () => {
    console.log("Resetando roupas...");

    // Define a cor padrão e remove todos os itens
    const defaultColor = {
      type: "SkinColor",
      src: "/assets/YU_cores/YU-roxo.svg",
    }; // Cor padrão
    dressUp(defaultColor);
    dressUp({ type: "Background", id: null }); // Remove o fundo
    dressUp({ type: "Shirts", id: null }); // Remove a camisa
    dressUp({ type: "Decor", id: null }); // Remove os acessórios

    // Atualiza os estados locais
    setSelectedBackground(null);
    setSelectedShirt(null);
    setSelectedAcc(null);
    setSelectedColor(defaultColor);

    // Atualiza o estado da mascote localmente para refletir as alterações
    setCurrentMascot((prevMascot) => ({
      ...prevMascot,
      accessoriesEquipped: {
        hat: null,
        shirt: null,
        color: "/assets/YU_cores/YU-roxo.svg",
        background: null,
      },
    }));
  };

  const saveOutfit = async () => {
    try {
      const payload = {
        hat: selectedAcc?.id || null,
        shirt: selectedShirt?.id || null,
        color: selectedColor?.id || 40, // Valor padrão para a cor
        background: selectedBackground?.id || null,
        id: currentMascot.id,
      };

      console.log("Payload enviado para salvar:", payload);

      await dispatch(saveFit(payload));

      // Atualiza o estado da mascote localmente para refletir as alterações
      setCurrentMascot((prevMascot) => ({
        ...prevMascot,
        accessoriesEquipped: {
          hat: payload.hat,
          shirt: payload.shirt,
          color: payload.color,
          background: payload.background,
        },
      }));

      // Atualiza os valores originais para refletir o novo estado
      setOriginalBackground(selectedBackground);
      setOriginalShirt(selectedShirt);
      setOriginalAcc(selectedAcc);
      setOriginalColor(selectedColor);

      // Exibe o popup de confirmação
      if (handleShowPopUpInfo) {
        handleShowPopUpInfo("Alterações guardadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      if (handleShowPopUpInfo) {
        handleShowPopUpInfo("Erro ao salvar as alterações. Tente novamente.");
      }
    }
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
            {/* Renderização da mascote */}
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

            {/* Outros acessórios */}
            {/* Camisa */}
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

            {/* Acessórios */}
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
                handleShowPopUpInfo={handleShowPopUpInfo}
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
                handleShowPopUpInfo={handleShowPopUpInfo}
                dressUp={dressUp}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
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

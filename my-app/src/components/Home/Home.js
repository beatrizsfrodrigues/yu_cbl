/*  src/components/Home/Home.js
    (versão completa e já integrada com o novo fluxo Closet + Store)
-------------------------------------------------------------------*/
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAuthUser,
  fetchOwnedAccessories,
  fetchEquippedAccessories,
  buyAccessory,
  equipAccessories,
} from "../../redux/usersSlice.js";
import { fetchAccessories } from "../../redux/accessoriesSlice.js";

import TopBar   from "../TopBar";
import Closet   from "./Closet";
import Store    from "./Store";
import PopUpInfo from "../PopUpInfo.js";
import "../../assets/css/home.css";

export default function Home() {
  const dispatch = useDispatch();

  /* ────────────────────────────
     REDUX state
  ────────────────────────────*/
  const user        = useSelector((s) => s.user.authUser);
  const owned       = useSelector((s) => s.user.ownedAccessories);
  const equipped    = useSelector((s) => s.user.equippedAccessories);
  const accessories = useSelector((s) => s.accessories.data);

  /* ────────────────────────────
     UI state
  ────────────────────────────*/
  const [showCloset, setShowCloset]   = useState(false);
  const [showStore,  setShowStore]    = useState(false);

  const [isPop,  setIsPop]  = useState(false);
  const [msgPop, setMsgPop] = useState("");

  /* Preview na Loja */
  const [selectedFit, setSelectedFit] = useState(null);

  /* Itens actualmente a mostrar no ecrã (preview OU equipados) */
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedShirt,      setSelectedShirt]      = useState(null);
  const [selectedAcc,        setSelectedAcc]        = useState(null);
  const [selectedColor,      setSelectedColor]      = useState(null);

  /* Para repor quando a Store fecha sem comprar */
  const [origBackground, setOrigBackground] = useState(null);
  const [origShirt,      setOrigShirt]      = useState(null);
  const [origAcc,        setOrigAcc]        = useState(null);
  const [origColor,      setOrigColor]      = useState(null);

  /* Para guardar alterações pendentes do Closet */
  const [pendingEquip, setPendingEquip] = useState({});

  /* ────────────────────────────
     Carregamento inicial
  ────────────────────────────*/
  useEffect(() => {
    dispatch(fetchAuthUser());
    dispatch(fetchOwnedAccessories());
    dispatch(fetchEquippedAccessories());   // devolve obj com hat/shirt/…
    dispatch(fetchAccessories());
  }, [dispatch]);

  /* Quando accessories + equipped chegam, reflecte-os no boneco */
  const findById = (id) =>
    accessories?.find((a) => a && a._id === id) || null;

  useEffect(() => {
    if (!accessories) return;
    setSelectedBackground(findById(equipped.background));
    setSelectedShirt(     findById(equipped.shirt));
    setSelectedAcc(       findById(equipped.hat));
    setSelectedColor(     findById(equipped.color));
  }, [accessories, equipped]);

  /* ────────────────────────────
     Helpers
  ────────────────────────────*/
  const pop = (m) => { setMsgPop(m); setIsPop(true); };
  const closePop = () => setIsPop(false);

  const formatPoints = (p) =>
    p >= 1e7 ? (p/1e6).toFixed(1).replace(".0","")+"M+"
    : p >= 1e4 ? (p/1e3).toFixed(1).replace(".0","")+"K+"
    : p;

  /* ────────────────────────────
     Store  (preview “nu”)
  ────────────────────────────*/
  const openStore = () => {
    setOrigBackground(selectedBackground);
    setOrigShirt(selectedShirt);
    setOrigAcc(selectedAcc);
    setOrigColor(selectedColor);

    setSelectedBackground(null);
    setSelectedShirt(null);
    setSelectedAcc(null);
    setSelectedColor(null);

    setShowStore(true);
  };

  const closeStore = () => {
    resetFit();
    setSelectedBackground(origBackground);
    setSelectedShirt(origShirt);
    setSelectedAcc(origAcc);
    setSelectedColor(origColor);
    setShowStore(false);
  };

  /* preview da loja */
  const addAccessory = (item) => {
    setSelectedFit(item);
    dressUp(item, item.type);
  };
  const resetFit = () => {
    setSelectedFit(null);
    dressUp(null, "all");
  };

  /* ────────────────────────────
     Closet  (preview por slot)
  ────────────────────────────*/



  const typeBySlot = { hat:"Decor", shirt:"Shirts",
                       background:"Backgrounds", color:"SkinColor" };
  const previewEquip = (slot, id) => {
    setPendingEquip((prev) => ({
      ...prev,
      [slot]: { id, type: typeBySlot[slot] }
    }));
    switch (slot) {
      case "background": setSelectedBackground(findById(id)); break;
      case "shirt":      setSelectedShirt(findById(id));      break;
      case "hat":        setSelectedAcc(findById(id));        break;
      case "color":      setSelectedColor(findById(id));      break;
      default:
    }
  };

  /* Gravar seleccionados */
  const saveOutfit = async () => {
    try {
        const reqs = Object.values(pendingEquip).map(({ id, type }) =>
              dispatch(equipAccessories({ accessoryId: id, type })).unwrap()
        );
      await Promise.all(reqs);
      setPendingEquip({});
      pop("Alterações guardadas!");
      setShowCloset(false);
    } catch (e) {
      pop("Erro ao guardar: " + e);
    }
  };

  /* ────────────────────────────
     Dress Up helper (preview)
  ────────────────────────────*/
  function dressUp(item, type) {
    if (!item) {
      switch (type) {
        case "Shirts":      setSelectedShirt(null);      break;
        case "Decor":       setSelectedAcc(null);        break;
        case "SkinColor":   setSelectedColor(null);      break;
        case "Backgrounds": setSelectedBackground(null); break;
        case "all":
          setSelectedBackground(null);
          setSelectedShirt(null);
          setSelectedAcc(null);
          setSelectedColor(null);
          break;
        default:
      }
    } else {
      if (item.type === "Shirts")        setSelectedShirt(item);
      else if (item.type === "Decor")    setSelectedAcc(item);
      else if (item.type === "SkinColor")setSelectedColor(item);
      else if (item.type === "Backgrounds") setSelectedBackground(item);
    }
  }

  /* ────────────────────────────
     Comprar da Store
  ────────────────────────────*/
  const buyItemBtn = () => {
    if (!selectedFit) return;
    dispatch(buyAccessory({ userId: user._id, accessoryId: selectedFit._id }))
      .unwrap()
      .then(() => {
        pop("Item comprado!");
        dispatch(fetchOwnedAccessories());
        closeStore();
      })
      .catch((e) => pop("Erro na compra: " + e));
  };

  /* ────────────────────────────
     Render
  ────────────────────────────*/
  if (!user || !accessories) return <div>Loading…</div>;

  return (
    <div className="homeContainer">
      <div className="backgroundDiv" />
      <div
        id="backgroundDiv"
        style={{
          backgroundImage: selectedBackground ? `url(${selectedBackground.src})` : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className={`home mainBody ${showCloset||showStore ? "locked" : ""}`}>
        {/* ─────── TopBar ─────── */}
        <TopBar>
          <div className="ClassStar">
            <ion-icon name="star-outline" class="icons" />
            <p>{formatPoints(user.points)}</p>
          </div>
          <div className="buttonsCloset">
            <button className="btnHomeHeader" onClick={() => setShowCloset(true)}>
              <ion-icon name="brush-outline" class="icons" />
            </button>
            <button className="btnHomeHeader" onClick={openStore}>
              <ion-icon name="bag-outline" class="icons" />
            </button>
          </div>
        </TopBar>

        {/* ─────── Mascote + acessórios ─────── */}
        <div className={`mascotContainer ${showCloset||showStore?"moveUp":""}`}>
          <img className="Yu" src={user.mascot} alt="Mascote" />

          {selectedColor && (
            <img
              className="accessory"
              style={{ position:"absolute", ...selectedColor }}
              src={selectedColor.src}
              alt=""
            />
          )}
          {selectedShirt && (
            <img
              className="accessory"
              style={{ position:"absolute", ...selectedShirt }}
              src={selectedShirt.src}
              alt=""
            />
          )}
          {selectedAcc && (
            <img
              className="accessory"
              style={{ position:"absolute", ...selectedAcc }}
              src={selectedAcc.src}
              alt=""
            />
          )}
        </div>

        {/* ─────── Closet Overlay ─────── */}
        {showCloset && (
          <Closet
            ownedAccessories={owned}
            equipped={{
              background: selectedBackground?._id || null,
              shirt:      selectedShirt?._id      || null,
              hat:        selectedAcc?._id        || null,
              color:      selectedColor?._id      || null,
            }}
            onPreview={previewEquip}
            onSave={saveOutfit}
            closeCloset={() => {
              // cancela preview
              setSelectedBackground(origBackground);
              setSelectedShirt(origShirt);
              setSelectedAcc(origAcc);
              setSelectedColor(origColor);
              setPendingEquip({});
              setShowCloset(false);
            }}
          />
        )}

        {/* ─────── Store Overlay ─────── */}
        {showStore && (
          <Store
            currentUser={user}
            ownedAccessories={owned}
            selectedFit={selectedFit}
            addAccessory={addAccessory}
            buyItemBtn={buyItemBtn}
            resetFit={resetFit}
            closeStore={closeStore}
            dressUp={dressUp}
            onShowPopUpInfo={pop}
          />
        )}
      </div>

      {isPop && <PopUpInfo onClose={closePop} message={msgPop} />}
    </div>
  );
}

// src/components/Home/Home.js
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

import TopBar from "../TopBar";
import Closet from "./Closet";
import Store from "./Store";
import PopUpInfo from "../PopUpInfo.js";
import "../../assets/css/home.css";

export default function Home() {
  const dispatch = useDispatch();

  /* ─── Redux state ────────────────────────── */
  const user        = useSelector((s) => s.user.authUser);
  const owned       = useSelector((s) => s.user.ownedAccessories);
  const equipped    = useSelector((s) => s.user.equippedAccessories);
  const accessories = useSelector((s) => s.accessories.data);

  /* ─── UI state ───────────────────────────── */
  const [showCloset, setShowCloset]   = useState(false);
  const [showStore,  setShowStore]    = useState(false);

  const [isPop,  setIsPop]            = useState(false);
  const [msgPop, setMsgPop]           = useState("");

  const [selectedFit, setSelectedFit] = useState(null);

  // itens atualmente no ecrã (equipados ou preview)
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedShirt,      setSelectedShirt]      = useState(null);
  const [selectedAcc,        setSelectedAcc]        = useState(null);
  const [selectedColor,      setSelectedColor]      = useState(null);

  // novos tipos
  const [selectedBigode,     setSelectedBigode]     = useState(null);
  const [selectedCachecol,   setSelectedCachecol]   = useState(null);
  const [selectedChapeu,     setSelectedChapeu]     = useState(null);
  const [selectedOuvidos,    setSelectedOuvidos]    = useState(null);
  const [selectedOculos,     setSelectedOculos]     = useState(null);

  /* ─── Backup para cancelamento de preview ─── */
  const [origBackground, setOrigBackground] = useState(null);
  const [origShirt,      setOrigShirt]      = useState(null);
  const [origAcc,        setOrigAcc]        = useState(null);
  const [origColor,      setOrigColor]      = useState(null);

  const [origBigode,   setOrigBigode]   = useState(null);
  const [origCachecol, setOrigCachecol] = useState(null);
  const [origChapeu,   setOrigChapeu]   = useState(null);
  const [origOuvidos,  setOrigOuvidos]  = useState(null);
  const [origOculos,   setOrigOculos]   = useState(null);

  const [pendingEquip, setPendingEquip] = useState({});

  /* ─── Carregamento inicial ───────────────── */
  useEffect(() => {
    dispatch(fetchAuthUser());
    dispatch(fetchOwnedAccessories());
    dispatch(fetchEquippedAccessories());
    dispatch(fetchAccessories());
  }, [dispatch]);

  const findById = (id) =>
    accessories?.find((a) => a && a._id === id) || null;

  /* ─── Quando equipped chegar, atualiza layers ─── */
  useEffect(() => {
    if (!accessories) return;
    setSelectedBackground(findById(equipped.background));
    setSelectedShirt(     findById(equipped.shirt));
    setSelectedAcc(       findById(equipped.hat));       // slot “Decor” antigo
    setSelectedColor(     findById(equipped.color));

    // novos
    setSelectedBigode(   findById(equipped.bigode));
    setSelectedCachecol( findById(equipped.cachecol));
    setSelectedChapeu(   findById(equipped.chapeu));
    setSelectedOuvidos(  findById(equipped.ouvidos));
    setSelectedOculos(   findById(equipped.oculos));
  }, [accessories, equipped]);

  /* ─── Helpers ───────────────────────────── */
  const pop = (m) => { setMsgPop(m); setIsPop(true); };
  const closePop = () => setIsPop(false);

  const formatPoints = (p) =>
    p >= 1e7 ? (p/1e6).toFixed(1).replace(".0","")+"M+" :
    p >= 1e4 ? (p/1e3).toFixed(1).replace(".0","")+"K+" :
    p;

  /* ─── Store ─────────────────────────────── */
  const openStore = () => {
    // guarda estado atual
    setOrigBackground(selectedBackground);
    setOrigShirt(     selectedShirt);
    setOrigAcc(       selectedAcc);
    setOrigColor(     selectedColor);

    setOrigBigode(selectedBigode);
    setOrigCachecol(selectedCachecol);
    setOrigChapeu(selectedChapeu);
    setOrigOuvidos(selectedOuvidos);
    setOrigOculos(selectedOculos);

    // limpa tudo para preview “nu”
    setSelectedBackground(null);
    setSelectedShirt(null);
    setSelectedAcc(null);
    setSelectedColor(null);

    setSelectedBigode(null);
    setSelectedCachecol(null);
    setSelectedChapeu(null);
    setSelectedOuvidos(null);
    setSelectedOculos(null);

    setShowStore(true);
  };
  const closeStore = () => {
    resetFit();
    // restaura
    setSelectedBackground(origBackground);
    setSelectedShirt(     origShirt);
    setSelectedAcc(       origAcc);
    setSelectedColor(     origColor);

    setSelectedBigode(origBigode);
    setSelectedCachecol(origCachecol);
    setSelectedChapeu(origChapeu);
    setSelectedOuvidos(origOuvidos);
    setSelectedOculos(origOculos);

    setShowStore(false);
  };

  const addAccessory = (item) => {
    setSelectedFit(item);
    dressUp(item, item.type);
  };
  const resetFit = () => {
    setSelectedFit(null);
    dressUp(null, "all");
  };

  /* ─── Closet preview ────────────────────── */
  const typeBySlot = {
    hat:        "Decor",
    shirt:      "Shirts",
    background: "Backgrounds",
    color:      "SkinColor",

    bigode:   "Bigode",
    cachecol: "Cachecol",
    chapeu:   "Chapeu",
    ouvidos:  "Ouvidos",
    oculos:   "Oculos",
  };


  const openCloset = () => {
  
    setOrigBackground(selectedBackground);
    setOrigShirt(     selectedShirt);
    setOrigAcc(       selectedAcc);
    setOrigColor(     selectedColor);
    setOrigBigode(origBigode   => setOrigBigode(selectedBigode));
    setOrigCachecol(origCachecol => setOrigCachecol(selectedCachecol));
    setOrigChapeu(origChapeu   => setOrigChapeu(selectedChapeu));
    setOrigOuvidos(origOuvidos => setOrigOuvidos(selectedOuvidos));
    setOrigOculos(origOculos   => setOrigOculos(selectedOculos));

    setPendingEquip({}); 
    setShowCloset(true);
  };

  const previewEquip = (slot, id) => {
    setPendingEquip((p) => ({
      ...p,
      [slot]: { id, type: typeBySlot[slot] },
    }));

    switch (slot) {
      case "background":   setSelectedBackground(findById(id)); break;
      case "shirt":        setSelectedShirt(findById(id));      break;
      case "hat":          setSelectedAcc(findById(id));        break;
      case "color":        setSelectedColor(findById(id));      break;

      case "bigode":       setSelectedBigode(findById(id));     break;
      case "cachecol":     setSelectedCachecol(findById(id));   break;
      case "chapeu":       setSelectedChapeu(findById(id));     break;
      case "ouvidos":      setSelectedOuvidos(findById(id));    break;
      case "oculos":       setSelectedOculos(findById(id));     break;

      default:
    }
  };

  const saveOutfit = async () => {
    try {
      for (const { id, type } of Object.values(pendingEquip)) {
        await dispatch(equipAccessories({ accessoryId: id, type })).unwrap();
      }
      setPendingEquip({});
      pop("Alterações guardadas!");
      setShowCloset(false);
    } catch (e) {
      pop("Erro ao guardar: " + e);
    }
  };

  /* ─── DressUp helper ───────────────────── */
  function dressUp(item, type) {
    if (!item) {
      // desfaz apenas o slot indicado
      switch (type) {
        case "Shirts":      setSelectedShirt(null);      break;
        case "Decor":       setSelectedAcc(null);        break;
        case "SkinColor":   setSelectedColor(null);      break;
        case "Backgrounds": setSelectedBackground(null); break;
        case "Bigode":      setSelectedBigode(null);     break;
        case "Cachecol":    setSelectedCachecol(null);   break;
        case "Chapeu":      setSelectedChapeu(null);     break;
        case "Ouvidos":     setSelectedOuvidos(null);    break;
        case "Oculos":      setSelectedOculos(null);     break;
        case "all":
          setSelectedBackground(null);
          setSelectedShirt(null);
          setSelectedAcc(null);
          setSelectedColor(null);
          setSelectedBigode(null);
          setSelectedCachecol(null);
          setSelectedChapeu(null);
          setSelectedOuvidos(null);
          setSelectedOculos(null);
          break;
        default:
      }
    } else {
      // aplica preview conforme item.type
      switch (item.type) {
        case "Shirts":    setSelectedShirt(item);      break;
        case "Decor":     setSelectedAcc(item);        break;
        case "SkinColor": setSelectedColor(item);      break;
        case "Backgrounds": setSelectedBackground(item); break;
        case "Bigode":    setSelectedBigode(item);     break;
        case "Cachecol":  setSelectedCachecol(item);   break;
        case "Chapeu":    setSelectedChapeu(item);     break;
        case "Ouvidos":   setSelectedOuvidos(item);    break;
        case "Oculos":    setSelectedOculos(item);     break;
        default:
      }
    }
  }

  /* ─── Comprar ───────────────────────────── */
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

  /* ─── Render ────────────────────────────── */
  if (!user || !accessories) return <div>Loading…</div>;

  return (
    <div className="homeContainer">

    <div id="decorBackground" />
      <div
        id="backgroundDiv"
        style={{
          backgroundImage: selectedBackground
            ? `url(${selectedBackground.src})`
            : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className={`home mainBody ${showCloset || showStore ? "locked" : ""}`}>
        <TopBar>
          <div className="ClassStar">
            <ion-icon name="star-outline" class="icons" />
            <p>{formatPoints(user.points)}</p>
          </div>
          <div className="buttonsCloset">
            <button className="btnHomeHeader" onClick={openCloset}>
              <ion-icon name="brush-outline" class="icons" />
            </button>
            <button className="btnHomeHeader" onClick={openStore}>
              <ion-icon name="bag-outline" class="icons" />
            </button>
          </div>
        </TopBar>

        {/* Mascote + camadas */}
       <div className={`mascotContainer ${showCloset ? "moveUpCloset" : showStore ? "moveUpStore" : ""}`}>
            <img
              src={user.mascot}
              className="base"
              alt="Mascote"
            />
            {selectedCachecol && (
              <img
                src={selectedCachecol.src}
                className="cachecol"
                alt="Cachecol"
              />
            )}
            {selectedChapeu && (
              <img
                src={selectedChapeu.src}
                className="chapeu"
                alt="Chapéu"
              />
            )}
            {selectedOuvidos && (
              <img
                src={selectedOuvidos.src}
                className="ouvidos"
                alt="Ouvidos"
              />
            )}
            {selectedOculos && (
              <img
                src={selectedOculos.src}
                className="oculos"
                alt="Óculos"
              />
            )}
            {selectedShirt && (
              <img
                src={selectedShirt.src}
                className="shirt"
                alt="Camisola"
              />
            )}
            {selectedBigode && (
              <img
                src={selectedBigode.src}
                className="bigode"
                alt="Bigode"
              />
            )}
          </div>
        {/* Closet */}
        {showCloset && (
          <Closet
            ownedAccessories={owned}
            equipped={{
              background: selectedBackground?._id || null,
              shirt:      selectedShirt?._id      || null,
              hat:        selectedAcc?._id        || null,
              color:      selectedColor?._id      || null,
              bigode:     selectedBigode?._id     || null,
              cachecol:   selectedCachecol?._id   || null,
              chapeu:     selectedChapeu?._id     || null,
              ouvidos:    selectedOuvidos?._id    || null,
              oculos:     selectedOculos?._id     || null,
            }}
            onPreview={previewEquip}
            onSave={saveOutfit}
            closeCloset={() => {
              // cancela preview
              setSelectedBackground(origBackground);
              setSelectedShirt(origShirt);
              setSelectedAcc(origAcc);
              setSelectedColor(origColor);
              setSelectedBigode(origBigode);
              setSelectedCachecol(origCachecol);
              setSelectedChapeu(origChapeu);
              setSelectedOuvidos(origOuvidos);
              setSelectedOculos(origOculos);
              setPendingEquip({});
              setShowCloset(false);
            }}
          />
        )}

        {/* Store */}
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

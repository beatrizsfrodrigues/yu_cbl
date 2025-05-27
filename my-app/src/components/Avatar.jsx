// src/components/Avatar.jsx
import React from "react";

export default function Avatar({
  mascot,
  equipped = {}, 
  accessoriesList,
  size = 150, // tamanho em px do container
}) {
  // destructura todos os tipos de acessório que agora tens
  const {
    background: bgId,
    shirt: shirtId,
    color: colorId,
    bigode: bigodeId,
    cachecol: cachecolId,
    chapeu: chapeuId,
    ouvidos: ouvidosId,
    oculos: oculosId,
  } = equipped;

  const findAcc = (id) =>
    accessoriesList.find((a) => String(a._id) === String(id)) || {};

  return (
    <div
      className="avatarWrapper"
      style={{
        position: "relative",
        width: size,
        height: size,
        overflow: "hidden",
      }}
    >
      {bgId && (
        <img
          src={findAcc(bgId).src}
          className="accessory background"
          alt=""
        />
      )}
      <img src={mascot} className="accessory base" alt="Mascote" />

      {colorId && (
        <img
          src={findAcc(colorId).src}
          className="accessory color"
          alt=""
        />
      )}
      {shirtId && (
        <img
          src={findAcc(shirtId).src}
          className="accessory shirt"
          alt=""
        />
      )}
      {bigodeId && (
        <img
          src={findAcc(bigodeId).src}
          className="accessory bigode"
          alt=""
        />
      )}
      {cachecolId && (
        <img
          src={findAcc(cachecolId).src}
          className="accessory cachecol"
          alt=""
        />
      )}
      {chapeuId && (
        <img
          src={findAcc(chapeuId).src}
          className="accessory chapeu"
          alt=""
        />
      )}
      {ouvidosId && (
        <img
          src={findAcc(ouvidosId).src}
          className="accessory ouvidos"
          alt=""
        />
      )}
      {oculosId && (
        <img
          src={findAcc(oculosId).src}
          className="accessory oculos"
          alt=""
        />
      )}
    </div>
  );
}

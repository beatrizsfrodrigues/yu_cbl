import React from "react";

export default function Avatar({
  mascot,
  equipped,
  accessoriesList,
  size = 150,         // px do container
  originalSize = 200, // px originais das coords
  accScale = 1,       // escala só para acessórios
  accOffsetX = 0,     // desloc horizontal em px para acessórios
  accOffsetY = 0      // desloc vertical em px para acessórios
}) {
  const { hat: hatId, shirt: shirtId, background: bgId } = equipped;
  const toPct = px => (px / originalSize) * 100 + "%";

  const findAcc = id =>
    accessoriesList.find(a => String(a._id) === String(id));

  // layer base — SEM transform
  const baseLayer = {
    src: mascot,
    style: {
      position: "absolute",
      top:    0,
      left:   0,
      width:  "100%",
      height: "100%",
      pointerEvents: "none",
    }
  };

  // constrói layers de acessório, aplicando transform só a eles
  const makeAccessoryLayer = (id) => {
    const acc = findAcc(id);
    if (!acc) return null;
    const layerStyle = {
      position: "absolute",
      left:   toPct(acc.left),
      bottom: toPct(acc.bottom),
      width:  toPct(acc.width),
      height: "auto",
      pointerEvents: "none",
      transform: `translate(${accOffsetX}px, ${accOffsetY}px) scale(${accScale})`,
      transformOrigin: "center bottom"
    };
    return { src: acc.src, style: layerStyle };
  };

  const layers = [
    baseLayer,
    makeAccessoryLayer(bgId),
    makeAccessoryLayer(shirtId),
    makeAccessoryLayer(hatId),
  ].filter(Boolean);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        overflow: "hidden",
      }}
    >
      {layers.map(({ src, style }, i) => (
        <img key={i} src={src} alt="" style={style} />
      ))}
    </div>
  );
}

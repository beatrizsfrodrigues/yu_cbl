import React from "react";
import QrReader from "react-qr-reader";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const handleScan = (data) => {
    if (data) {
      onScanSuccess(data);
    }
  };

  const handleError = (err) => {
    console.error("Erro ao ler o QR:", err);
  };

  return (
    <div className="scanner-container">
      <h2>Scan o código QR</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default QRScanner;

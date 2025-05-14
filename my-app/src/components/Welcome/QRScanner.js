import React from "react";
import { QrReader } from "react-qr-reader";

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
      <div className="qr-wrapper">
        <QrReader delay={300} onError={handleError} onScan={handleScan} />
      </div>
      <button className="submitBtn orangeBtn" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default QRScanner;

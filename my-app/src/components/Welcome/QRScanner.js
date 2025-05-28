import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: 250,
            },
            (decodedText) => {
              onScanSuccess(decodedText);
              html5QrCode.stop();
            },
            (errorMessage) => {
              console.warn("QR scan error:", errorMessage);
            }
          )
          .catch((err) => console.error("Unable to start scanning", err));
      }
    });

    return () => {
      html5QrCode.stop().catch((err) => console.error("Stop failed", err));
    };
  }, [onScanSuccess]);

  return (
    <div className="scanner-container">
      <h2>Scan o código QR</h2>
      <div id="qr-reader" ref={scannerRef} style={{ width: "300px" }} />
      <button className="submitBtn orangeBtn" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default QRScanner;

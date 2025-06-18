import React, { useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      const state = html5QrCodeRef.current.getState();
      if (state === 2 /* RUNNING */ || state === 1 /* PAUSED */) {
        try {
          await html5QrCodeRef.current.stop();
          await html5QrCodeRef.current.clear();
        } catch (err) {
          console.warn("Erro ao parar o scanner:", err.message);
        }
      }
    }
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (!scannerRef.current) {
          console.error("Elemento do scanner não foi montado ainda.");
          return;
        }

        const readerId = scannerRef.current.id;
        if (!readerId) {
          console.error("Elemento scannerRef precisa ter um ID.");
          return;
        }

        html5QrCodeRef.current = new Html5Qrcode(readerId);
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          console.error("Nenhuma câmera encontrada.");
          return;
        }

        const backCamera = devices.find(
          (d) =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("trás") ||
            d.label.toLowerCase().includes("rear")
        );

        const selectedCamera = backCamera || devices[0];

        await html5QrCodeRef.current.start(
          selectedCamera.id,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true;
              onScanSuccess(decodedText);
              stopScanner();
            }
          },
          (errorMessage) => {
            if (!errorMessage.includes("NotFoundException")) {
              console.warn("Erro no scan:", errorMessage);
            }
          }
        );
      } catch (err) {
        console.error("Erro ao iniciar o scanner:", err.message);
      }
    };

    const timeout = setTimeout(() => {
      startScanner();
    }, 100); // pequeno delay para garantir que o DOM existe

    return () => {
      clearTimeout(timeout);
      stopScanner();
    };
  }, [onScanSuccess, stopScanner]);

  return (
    <div className="scanner-container">
      <h2>Scan o código QR</h2>
      <div id="qr-reader" ref={scannerRef} style={{ width: "300px" }} />
      <button
        className="submitBtn orangeBtn"
        onClick={async () => {
          hasScannedRef.current = true;
          await stopScanner();
          onClose();
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default QRScanner;

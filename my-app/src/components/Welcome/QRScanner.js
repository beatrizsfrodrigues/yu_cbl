import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [scannerRunning, setScannerRunning] = useState(false);
  const hasScannedRef = useRef(false); // Flag to prevent multiple scans

  useEffect(() => {
    if (!scannerRef.current) {
      console.error("Scanner element not found");
      return;
    }

    html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          console.error("No cameras found.");
          return;
        }
        const cameraId = devices[0].id;

        if (scannerRunning) {
          console.warn("Scanner already running");
          return;
        }

        await html5QrCodeRef.current.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true; // Mark as scanned
              onScanSuccess(decodedText); // Notify parent
              stopScanner(); // Stop scanner immediately
            }
          },
          (errorMessage) => {
            // Ignore expected parse errors
            if (!errorMessage.includes("NotFoundException")) {
              console.warn("QR scan error:", errorMessage);
            }
          }
        );
        setScannerRunning(true);
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    const stopScanner = async () => {
      if (!scannerRunning) return;
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        setScannerRunning(false);
      } catch (err) {
        // Ignore errors if scanner not running
        if (
          !(
            err?.message?.includes("not running") ||
            err?.message?.includes("not running or paused") ||
            (typeof err === "string" &&
              (err.includes("not running") ||
                err.includes("not running or paused")))
          )
        ) {
          console.error("Stop failed", err);
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScanSuccess, scannerRunning]);

  return (
    <div className="scanner-container">
      <h2>Scan o código QR</h2>
      <div id="qr-reader" ref={scannerRef} style={{ width: "300px" }} />
      <button
        className="submitBtn orangeBtn"
        onClick={() => {
          if (!hasScannedRef.current) {
            hasScannedRef.current = true; // Prevent further scans
            html5QrCodeRef.current.stop().then(() => {
              html5QrCodeRef.current.clear();
              setScannerRunning(false);
              onClose();
            });
          } else {
            onClose();
          }
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default QRScanner;

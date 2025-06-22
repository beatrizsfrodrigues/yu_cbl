import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import mascotImg from "../assets/imgs/YU_icon/Group-48.webp";
import "../assets/css/LoadingScreen.css";

export default function LoadingScreen({ onFinish, isOverlay = false }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish?.(), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className={isOverlay ? "loading-overlay" : "loading-container"}>
      <div className="loading-content">
        <div style={{ transform: "scale(0.4)", transformOrigin: "center" }}>
          <motion.img
            src={mascotImg}
            alt="Mascote a saltar"
            animate={{ y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      </div>

      <div className="progressbar-container">
        <motion.div
          className="progress-bar-fill"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <p className="progress-text">{progress}%</p>
    </div>
  );
}

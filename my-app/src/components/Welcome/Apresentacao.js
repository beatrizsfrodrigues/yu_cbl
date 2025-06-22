import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./apresentacao.css";
import { Link, useNavigate } from "react-router-dom";

const pages = [
  { title: "1. Questionário", text: "Antes de entrares nesta aventura connosco precisamos que respondas a 3 perguntas.", media: { type: "image", src: "/assets/imgs_Apresentacao/questionario.webp" } },
  { title: "2. Cria a tua ligação", text: "Na página de ligação deves introduzir o código que representa o teu amigo. Se não tens, podes passar este passo e voltar mais tarde nas definições.", media: { type: "image", src: "/assets/imgs_Apresentacao/amigo.webp" } },
  { title: "3. Explora a YU", text: "Tens 3 áreas: Casa (personaliza a tua YU), Tarefas (tudo do teu amigo) e Perfil (os teus dados e definições).", media: { type: "image", src: "/assets/imgs_Apresentacao/menu.webp" } },
  { title: "4. Realiza tarefas", text: "Seleciona a tarefa, completa-a e envia uma prova em imagem para o teu amigo. Não vale batota!", media: { type: "video", src: "/assets/imgs_Apresentacao/verTarefa.mp4" } },
  { title: "5. Bem-vindo à YU!", text: "Tudo está pronto para começares a tua aventura.", media: { type: "image", src: "/assets/imgs_Apresentacao/YUsaiaAMAR.webp" }, cta: { text: "Começar!", link: "/questions" } },
];

export default function Apresentacao() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigate = useNavigate();
  const last = pages.length - 1;
  const minSwipeDistance = 50;

  // Preload images
  useEffect(() => {
    pages.forEach(p => {
      if (p.media.type === 'image') {
        const img = new Image();
        img.src = p.media.src;
      }
    });
  }, []);

  const handleNext = () => setCurrent(prev => Math.min(prev + 1, last));
  const handlePrev = () => setCurrent(prev => Math.max(prev - 1, 0));

  const handleTouchStart = e => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const dist = touchStart - touchEnd;
      if (dist > minSwipeDistance) handleNext();
      else if (dist < -minSwipeDistance) handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="ap-fullscreen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
          onClick={() => navigate("/register")}
          disabled={current === 0}
          aria-label="Voltar"
          className="skip-voltar-btn"
        >
          <FaChevronLeft size={16} /> Voltar
        </button>
      {/* Header: Logo, Back and Skip */}
      <div className="skip-container">
        <img src="/assets/Logo/YU_boneca_a_frente.svg" alt="Logo YU" className="skip-logo" />
        
        <button
          onClick={() => navigate('/questions')}
          className="skip-btn"
        >
          Passar à frente Instruções
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progresss-bar">
        <div className="progresss" style={{ width: `${(current / last) * 100}%` }} />
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.15 }}
        >
          <h2 className="slide-title">{pages[current].title}</h2>
          <p className="slide-text">{pages[current].text}</p>

          {pages[current].media.type === 'image' ? (
            <img
              className="slide-media"
              src={pages[current].media.src}
              alt={pages[current].title}
            />
          ) : (
            <video
              className="slide-media"
              src={pages[current].media.src}
              preload="auto"
              autoPlay
              loop
              muted
            />
          )}

          {pages[current].cta && (
            <Link to={pages[current].cta.link}>
              <button className="cta-button">{pages[current].cta.text}</button>
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="controls">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          aria-label="Anterior"
          className="control-btn prev"
        >
          <FaChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={current === last}
          aria-label="Próximo"
          className="control-btn next"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

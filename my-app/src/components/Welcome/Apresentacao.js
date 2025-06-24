import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./apresentacao.css";

const pages = [
  {
    title: "1. Questionário",
    text: "Antes de entrares nesta aventura connosco precisamos que respondas a algumas perguntas.",
    media: {
      type: "image",
      src: "/assets/imgs_Apresentacao/questionario.webp",
    },
  },
  {
    title: "2. Cria a tua ligação",
    text: "Na página de ligação deves introduzir o código/código QR que representa o teu amigo. Se ainda não tens, podes passar este passo à frente e voltar mais tarde. Basta ires às definições.",
    media: {
      type: "image",
      src: "/assets/imgs_Apresentacao/ligacao.webp",
    },
  },
  {
    title: "3. Explora a YU",
    text: "Tens 3 áreas: Casa (personaliza a tua YU), Tarefas (que deves completar com sucesso), Mensagens (onde podes enviar mensagens pré-definidas ao teu amigo) e Perfil (com os teus dados e as definições).",
    media: {
      type: "video",
      src: "/assets/imgs_Apresentacao/menu.mp4",
    },
  },
  {
    title: "4. Personaliza o teu YU",
    text: "Na secção da 'Casa', consegues personalizar o teu YU. Podes ir ao teu closet ou comprar novos acessórios (Não te esqueças de colecionar as estrelas para conseguires comprar tudo o que queres!).",
    media: {
      type: "video",
      src: "/assets/imgs_Apresentacao/home.mp4",
      className: "small-video",
    },
  },
  {
    title: "5. Realiza tarefas",
    text: "Seleciona a tarefa, completa-a e envia uma prova em imagem para o teu amigo. Não vale batota!",
    media: {
      type: "video",
      src: "/assets/imgs_Apresentacao/tarefas.mp4",
    },
  },
  {
    title: "6. Bem-vindo à YU!",
    media: {
      type: "image",
      src: "/assets/imgs_Apresentacao/logo.png",
    },
    cta: { text: "Começar!", link: "/questions" },
  },
];

export default function Apresentacao() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const last = pages.length - 1;
  const minSwipeDistance = 50;

  // Preload images
  useEffect(() => {
    pages.forEach((p) => {
      if (p.media.type === "image") {
        const img = new Image();
        img.src = p.media.src;
      }
    });
  }, []);

  const handleNext = () => setCurrent((prev) => Math.min(prev + 1, last));
  const handlePrev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  const handleTouchStart = (e) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const dist = touchStart - touchEnd;
      if (dist > minSwipeDistance) handleNext();
      else if (dist < -minSwipeDistance) handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Voltar: se veio de definições, faz history.back; senão vai para /register
  const handleBack = () => {
    if (location.state?.from === "settings") {
      navigate(-1);
    } else {
      navigate("/register");
    }
  };

  // Começar: se veio de definições, volta; senão vai para /questions
  const handleStart = () => {
    if (location.state?.from === "settings") {
      navigate(-1);
    } else {
      navigate(pages[last].cta.link);
    }
  };

  return (
    <div
      className="ap-fullscreen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
     {/* Só mostra o botão se viermos de “settings” */}
      {location.state?.from === 'settings' && (
        <button
          onClick={handleBack}
          aria-label="Voltar"
          className="skip-voltar-btn"
        >
          <FaChevronLeft size={16} /> Voltar
        </button>
      )}

      {/* Header: Logo e Skip */}
      <div className="skip-container">
        <img
          src="/assets/Logo/YU_boneca_a_frente.svg"
          alt="Logo YU"
          className="skip-logo"
        />
        <button onClick={() => navigate("/questions")} className="skip-btn">
          Passar à frente Instruções
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progresss-bar">
        <div
          className="progresss"
          style={{ width: `${(current / last) * 100}%` }}
        />
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
          {pages[current].title && (
            <h2 className="slide-title">{pages[current].title}</h2>
          )}
          {pages[current].text && (
            <p className="slide-text">{pages[current].text}</p>
          )}

          {pages[current].media.type === "image" ? (
            <img
              className="slide-media"
              src={pages[current].media.src}
              alt={pages[current].title}
            />
          ) : (
            <video
              className={`slide-media ${
                pages[current].media.className || ""
              }`}
              src={pages[current].media.src}
              preload="auto"
              autoPlay
              loop
              muted
            />
          )}

          {pages[current].cta && current === last && (
            <button className="cta-button" onClick={handleStart}>
              {pages[current].cta.text}
            </button>
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

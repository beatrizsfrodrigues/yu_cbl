import React, { useEffect, useRef } from "react";
import "../Grafico/grafico.css";    // mantém o teu modal/janela
import "./informacoes.css";         // novos estilos dos cards

export default function Informacoes({ show, onClose }) {
  const contentRef = useRef(null);

  const pages = [
    {
      title: "SOS Voz Amiga",
      description:
        "Linha de apoio emocional para todas as idades, disponível diariamente.",
      contact: [
        "213 544 545",
        "912 802 669",
        "963 524 660 (diariamente, das 15h30 às 00h30)"
      ],
      link: "https://www.sosvozamiga.org/",
      color: "#FFAB5C"
    },
    {
      title: "Conversa Amiga",
      description:
        "Linha de apoio emocional que oferece escuta ativa e confidencialidade.",
      contact: ["808 237 327", "210 027 159 (todos os dias, das 15h às 22h)"],
      link: "https://conversa.pt/",
      color: "#E1D7E9"
    },
    {
      title: "Voz de Apoio",
      description: "Linha de apoio emocional disponível à noite.",
      contact: ["225 506 070 (das 21h às 24h)"],
      email: "sos@vozdeapoio.pt",
      link: "https://www.vozdeapoio.pt/",
      color: "#AFE1DF"
    }
  ];

  useEffect(() => {
    if (show && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="window" onClick={e => e.stopPropagation()}>
        <div className="grafico-header">
          <h3>Informações</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            className="icons"
            style={{ fontSize: "28px" }}
          />
        </div>
        <div className="line" />

        <div className="grafico-content" ref={contentRef}>
          {/* Introdução */}
          <div className="grafico-section">
            <h3>Sabias que …</h3>
            <p className="informacao-text">
              <strong>1.</strong> O uso excessivo das redes sociais leva a um aumento de <em>ansiedade</em> e <em>depressão</em>.
            </p>
            <p className="informacao-text">
              <strong>2.</strong> O uso das redes sociais antes de dormir pode levar à <em>insónia</em> e distúrbios do sono devido à luz azul.
            </p>
            <p className="informacao-text">
              <strong>3.</strong> O uso constante das redes sociais pode afetar negativamente a tua <em>concentração</em> e os teus resultados escolares.
            </p>
            <h3>Nunca estás sozinho</h3>
            <p className="informacao-text">
              Se precisares de ajuda, pede. Não tenhas vergonha.
            </p>
          </div>

          {/* Cards simples em grid */}
          <div className="cards-container">
            {pages.map((page, idx) => (
              <div
                key={idx}
                className="contact-card"
                style={{ backgroundColor: page.color }}
              >
                <h4 className="card-title">{page.title}</h4>
                <p className="card-description">{page.description}</p>
                <ul className="contact-list">
                  {page.contact.map((c, i) => (
                    <li key={i} className="contact-item">{c}</li>
                  ))}
                </ul>
                {page.email && <p className="card-email">Email: {page.email}</p>}
                <a
                  href={page.link}
                  className="card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Saber mais
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

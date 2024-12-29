import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Informacoes/informacoes.css";

 

const Informacoes = () => {
    const [currentPage, setCurrentPage] = useState(0);
  
    const pages = [
      {
        title: "SOS Voz Amiga",
        description:
          "Linha de apoio emocional para todas as idades, disponível diariamente.",
        contact: [
          "213 544 545",
          "912 802 669",
          "963 524 660 (diariamente, das 15h30 às 00h30)",
        ],
        link: "https://saudemental.min-saude.pt",
      },
      {
        title: "Conversa Amiga",
        description:
          "Linha de apoio emocional que oferece escuta ativa e confidencialidade.",
        contact: ["808 237 327", "210 027 159 (todos os dias, das 15h às 22h)"],
        link: "https://saudemental.min-saude.pt",
      },
      {
        title: "Voz de Apoio",
        description: "Linha de apoio emocional disponível à noite.",
        contact: ["225 506 070 (das 21h às 24h)"],
        email: "sos@vozdeapoio.pt",
        link: "https://saudemental.min-saude.pt",
      },
    ];
  
    const handlePageChange = (index) => {
      setCurrentPage(index);
    };
  
    return (
      <div className="informacoes-container">
        {/* Cabeçalho */}
        <header className="informacoes-header">
          <button className="back-button">
            <Link to="/profile" className="back-link">
                <i className="bi bi-arrow-left"></i>
            </Link>
          </button>

          <h1 className="informacoes-title">Informações</h1>
        </header>
  
        {/* Secção principal */}
        <section className="informacoes-content">
          <h2>Sabias que ...</h2>
          <div className="informacoes-list">
            <div className="informacao-item">
              <h3>1.</h3>
              <p>
                O uso excessivo das redes sociais leva a um aumento de{" "}
                <em>ansiedade</em> e <em>depressão</em>.
              </p>
            </div>
            <div className="informacao-item">
              <h3>2.</h3>
              <p>
                O uso das redes sociais antes de dormir pode levar à{" "}
                <em>insónia</em> e distúrbios do sono devido à luz azul.
              </p>
            </div>
            <div className="informacao-item">
              <h3>3.</h3>
              <p>
                O uso constante das redes sociais pode afetar negativamente a tua{" "}
                <em>concentração</em> e os teus resultados escolares.
              </p>
            </div>
          </div>
          <hr />
          <h2>Nunca estás sozinho</h2>
          <p>Se precisares de ajuda, pede. Não tenhas vergonha.</p>
  
          {/* Página atual de apoio */}
          <div className="contact-info">
            <h3>{pages[currentPage].title}</h3>
            <p>{pages[currentPage].description}</p>
            <p>
              <strong>Telefone:</strong> {pages[currentPage].contact.join(" | ")}
            </p>
            {pages[currentPage].email && (
              <p>
                <strong>Email:</strong> {pages[currentPage].email}
              </p>
            )}
            <a href={pages[currentPage].link} target="_blank" rel="noopener noreferrer">
              Mais informações
            </a>
          </div>
        </section>
  
        {/* Paginação */}
        <div className="pagination">
          {pages.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${
                index === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(index)}
            ></button>
          ))}
        </div>
      </div>
    );
  };
  
  export default Informacoes;
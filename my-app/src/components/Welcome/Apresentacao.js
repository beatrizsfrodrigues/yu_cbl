import React, { useState } from "react";
import "./apresentacao.css";
import { Link } from "react-router-dom";

const pages = [
  {
    mainTitle: "1.",
    subTitle: "Responder a um pequeno Questionário",
    description:
      "Antes de entrares nesta aventura connosco precisamos que respondas a 3 perguntas.",
    image: "/assets/imgs_Apresentacao/questionario.webp",
  },
  {
    mainTitle: "2.",
    subTitle: "Cria a tua ligação com o teu amigo",
    description1: (
      <>
        <p>
          Na página de ligação deves introduzir o código que representa o teu
          amigo nesta aventura.
        </p>
      </>
    ),
    image1: "/assets/imgs_Apresentacao/amigo.webp",
    description2: (
      <>
        <p>
          Se ainda não tiveste acesso ao código, não há problema. Podes passar
          esse passo à frente.
        </p>
        <p>
          Para fazeres a ligação basta acederes à tua área de perfil e ires às
          tuas defenições e depois selecionas a opção "Fazer Ligação".{" "}
        </p>
        <p>
          <strong>Atenção: </strong> sem amigo na Yu não consegues realizar
          tarefas, nem personalizar a tua mascote.
        </p>
      </>
    ),
    image2: "/assets/imgs_Apresentacao/maisTarde.webp",
  },
  {
    mainTitle: "3.",
    subTitle: "YU",
    description: (
      <>
        <p>Na YU encontras 3 áreas diferentes</p>
        <p></p>
        <p>Na casa podes personalizar a tua YU.</p>
        <p>
          Nas tarefas tens acesso a todas as informações das tarefas que o teu
          amigo te propôs.
        </p>
        <p>Na área de perfil tens acesso aos teus dados e às defenições.</p>
      </>
    ),
    image: "/assets/imgs_Apresentacao/menu.webp",
  },
  {
    mainTitle: "4.",
    subTitle: "Tarefa",
    description1: (
      <>
        <p>
          Sempre que quiseres saber as tarefas que tens por fazer deves
          selecioná-las.
        </p>
      </>
    ),
    video: "/assets/imgs_Apresentacao/verTarefa.mp4",
    description2: (
      <>
        <p>
          Para concluires a tua tarefa, tens que submeter uma imagem para
          comprovares ao teu amigo que a cumpriste com sucesso.
        </p>
        <p>
          <strong>Não vale fazer batota!</strong>
        </p>
      </>
    ),
  },
  {
    mainTitle: "5.",
    subTitle: "Bem - Vindo à YU",
    images: ["/assets/imgs_Apresentacao/YUsaiaAMAR.webp"],
  },
];

const Apresentacao = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handlePageChange = (index) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPage(index);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handlePageChange(currentPage + 1);
    }

    if (isRightSwipe) {
      handlePageChange(currentPage - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className={`apresentacao-container page-${currentPage}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="apresentacao-header">
        <h1 className="apresentacao-title">YU</h1>
        <Link to="/questions" className="button-link">
          <button
            aria-label="Passar para o Formulário... Avançar para o formulário"
            className="button-outside-slide"
          >
            Passar para o Formulário...
          </button>
        </Link>
      </header>
      <section className="apresentacao-content">
        <div className="apresentacao-info">
          <h2>{pages[currentPage].mainTitle}</h2>
          <h3>{pages[currentPage].subTitle}</h3>
          {currentPage === 1 && (
            <>
              <p>{pages[currentPage].description1}</p>
              <div className="image-container">
                <img
                  src={pages[currentPage].image1}
                  alt="Ligação com amigo"
                  className="image"
                />
              </div>
              <p>{pages[currentPage].description2}</p>
              <div className="image-container">
                <img
                  src={pages[currentPage].image2}
                  alt="Acesso mais tarde"
                  className="image"
                />
              </div>
            </>
          )}
          {currentPage !== 1 && (
            <>
              <p>{pages[currentPage].description}</p>
              {pages[currentPage].image && (
                <div className="image-container">
                  <img
                    src={pages[currentPage].image}
                    alt="Prévia da atualização"
                    className="image"
                  />
                </div>
              )}
            </>
          )}
          {currentPage === 3 && (
            <>
              <p>{pages[currentPage].description1}</p>
              {pages[currentPage].video && (
                <div className="image-container">
                  <video
                    src={pages[currentPage].video}
                    autoPlay
                    loop
                    muted
                    className="image"
                  >
                    O seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              )}
              <p>{pages[currentPage].description2}</p>
            </>
          )}
          {currentPage === 4 && (
            <>
              <div className="image-container">
                {pages[currentPage].images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="image"
                  />
                ))}
              </div>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Link to="/questions" className="comecar-button-link">
                  <button
                    aria-label="Começar! Botão para começar"
                    className="comecar-button"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "var(--purple)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Começar!
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <div className="pagination">
        {pages.map((_, index) => (
          <button
            aria-label={`Navegar para a página ${index + 1}`}
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

export default Apresentacao;

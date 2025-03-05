import React, { useState } from "react";
import "./questions.css";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();

  const questionData = [
    {
      question: "Quanto tempo passas no telemóvel por dia?",
      options: [
        "Menos de 1 hora",
        "1-3 horas",
        "3-4 horas",
        "4-5 horas",
        "5-7 horas",
        "Mais de 7 horas",
      ],
    },
    {
      question: "Que problemas encontras atualmente?",
      options: [
        "Fazer scroll sem pensar",
        "Recorrer ao telemóvel logo após acordar",
        "Escapar à realidade",
        "Ganhar ansiedade",
        "Constantemente ver notificações",
        "Distrair-me das minhas tarefas",
      ],
    },
    {
      question: "O que mais gostas de fazer no telemóvel?",
      options: [
        "Estar nas redes sociais",
        "Jogar",
        "Ver vídeos ou séries",
        "Conversar com amigos",
      ],
    },
    {
      question: "Já tentaste reduzir o tempo no telemóvel?",
      options: ["Sim", "Não, é a primeira vez"],
    },
    {
      question: "Se respondes-te sim, como correu?",
      options: [
        "Correu bastante bem, consegui reduzir",
        "Correu bem mas foi difícil e voltei aos mesmos hábitos",
        "Correu mal, não consegui reduzir",
        "Respondi não à pergunta anterior",
      ],
    },
    {
      question: "Como te sentes quando não tens acesso ao teu telemóvel?",
      options: [
        "Ansioso/a ou frustrado/a",
        "Aliviado/a e mais presente",
        "Indiferente, não me afeta muito",
        "Depende da situação",
        "Não sei, nunca tentei",
      ],
    },
    {
      question: "O que gostarias de mudar no teu uso do telemóvel??",
      options: [
        "Passar menos tempo no telemóvel",
        "Usá-lo de forma mais produtiva",
        "Evitar comparar-me com os outros",
        "Ter mais controlo sobre quando e como o uso",
        "Estou satisfeito/a com o meu uso",
      ],
    },
    {
      question: "O que mais te motiva a usar o telemóvel?",
      options: [
        "Trabalho ou estudo",
        "Entretenimento",
        "Comunicação",
        "Informação e notícias",
        "FOMO (Fear of Missing Out)",
        "Já se tornou um hábito",
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Em vez de guardar apenas 1 valor, guardamos um array com os índices selecionados
  const [selectedOptions, setSelectedOptions] = useState([]);

  const currentQuestion = questionData[currentQuestionIndex];
  // Exemplo simples: permita múltipla seleção somente na segunda pergunta (índice 1)
  const isMultiSelect = currentQuestionIndex === 1;

  const handleOptionClick = (index) => {
    if (isMultiSelect) {
      // Se já existir o array, remove
      if (selectedOptions.includes(index)) {
        setSelectedOptions(selectedOptions.filter((i) => i !== index));
      } else {
        setSelectedOptions([...selectedOptions, index]);
      }
    } else {
      // Pergunta de escolha única
      setSelectedOptions([index]);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOptions.length === 0) {
      return; // Não avança se não houver nada selecionado
    }

    const selectedAnswers = selectedOptions.map(
      (i) => currentQuestion.options[i]
    );
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedUser) {
      console.error("Nenhum utilizador está autenticado.");
      return;
    }

    // Encontrar o utilizador dentro do users array
    const userIndex = users.findIndex((user) => user.id === loggedUser.id);

    if (userIndex !== -1) {
      // Atualizar as respostas do utilizador logado
      users[userIndex].initialFormAnswers.push({
        question: currentQuestion.question,
        answers: selectedAnswers,
      });

      // Guardar os dados no localstorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(users[userIndex])); // Atualizar o loggedUser também
    } else {
      console.error("Utilizador não encontrado.");
    }

    console.log(
      `Pergunta: ${
        currentQuestion.question
      } | Respostas: ${selectedAnswers.join(", ")}`
    );

    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
    } else {
      console.log("Fim do questionário");
      navigate("/connection");
    }
  };

  return (
    <div className="questions-container mainBody">
      <p className="question-title">{currentQuestion.question}</p>
      {/* Texto adaptado para multi ou single */}
      <p className="question-desc">
        {isMultiSelect
          ? "Podes selecionar várias opções."
          : "Seleciona apenas uma opção."}
      </p>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOptions.includes(index);
          return (
            <div
              key={index}
              className={`option ${isSelected ? "selected" : ""}`}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </div>
          );
        })}
      </div>

      <button
        className={`continue-button ${
          selectedOptions.length === 0 ? "disabled" : ""
        }`}
        onClick={handleNextQuestion}
        disabled={selectedOptions.length === 0}
      >
        Continuar
      </button>
    </div>
  );
};

export default Questions;

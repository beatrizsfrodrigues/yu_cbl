import React, { useEffect, useState } from "react";
import "./questions.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchForm } from "../../redux/formSlice"; // caminho pode variar

const Questions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: questionData, status, error } = useSelector((state) => state.form);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchForm());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>A carregar perguntas...</p>;
  if (status === "failed") return <p>Erro ao carregar: {error}</p>;
  if (!questionData || questionData.length === 0) return <p>Nenhuma pergunta disponível.</p>;

  const currentQuestion = questionData?.[currentQuestionIndex];

  if (!currentQuestion) return <p>A carregar pergunta atual...</p>;

  const isMultiSelect = currentQuestionIndex === 1;

  const handleOptionClick = (index) => {
    if (isMultiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOptions.length === 0) return;

    const selectedAnswers = selectedOptions.map((i) => currentQuestion.answers[i]);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedUser) {
      console.error("Nenhum utilizador está autenticado.");
      return;
    }

    const userIndex = users.findIndex((user) => user.id === loggedUser.id);
    if (userIndex !== -1) {
      users[userIndex].initialFormAnswers.push({
        question: currentQuestion.question,
        answers: selectedAnswers,
      });

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));
    }

    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      const questionTimes = JSON.parse(localStorage.getItem("questionTimes")) || {};
      questionTimes[loggedUser.id] = Date.now();
      localStorage.setItem("questionTimes", JSON.stringify(questionTimes));
      navigate("/connection");
    }
  };

  return (
    <div className="questions-container mainBody">
      <p className="question-title">{currentQuestion.question}</p>
      <p className="question-desc">
        {isMultiSelect
          ? "Podes selecionar várias opções."
          : "Seleciona apenas uma opção."}
      </p>

            <div className="options-container">
        {currentQuestion.answers.map((option, index) => {
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
        className={`continue-button ${selectedOptions.length === 0 ? "disabled" : ""}`}
        onClick={handleNextQuestion}
        disabled={selectedOptions.length === 0}
      >
        Continuar
      </button>
    </div>
  );
};

export default Questions;

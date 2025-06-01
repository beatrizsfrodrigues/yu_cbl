import React, { useEffect, useState } from "react";
import "./questions.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchForm } from "../../redux/formSlice";
import { getAuthUser } from "../../utils/cookieUtils";
import { postFormAnswers } from "../../redux/formAnswersSlice";

const Questions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: questionData,
    status,
    error,
  } = useSelector((state) => state.form);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formAnswers, setFormAnswers] = useState([]);

  const [authUser] = useState(getAuthUser());

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchForm());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>A carregar perguntas...</p>;
  if (status === "failed") return <p>Erro ao carregar: {error}</p>;
  if (!questionData || questionData.length === 0)
    return <p>Nenhuma pergunta disponível.</p>;

  const activeQuestions = questionData.filter((q) => q.active);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  if (!currentQuestion) return <p>Nenhuma pergunta ativa encontrada.</p>;

  const isMultiSelect = currentQuestion.multiselect;

  const handleOptionClick = (index) => {
    if (isMultiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedOptions.length === 0) return;

    const selectedAnswers = selectedOptions.map(
      (i) => currentQuestion.answers[i]
    );

    if (!authUser) {
      console.error("Nenhum utilizador está autenticado.");
      return;
    }

    const newAnswer = {
      question: currentQuestion._id,
      answer: selectedAnswers,
    };

    const updatedAnswers = [...formAnswers, newAnswer];

    setFormAnswers(updatedAnswers);

    if (currentQuestionIndex === activeQuestions.length - 1) {
      try {
        await dispatch(postFormAnswers({ answers: updatedAnswers })).unwrap();
        navigate("/connection");
      } catch (err) {
        console.error("Erro ao submeter respostas:", err);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions([]);
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

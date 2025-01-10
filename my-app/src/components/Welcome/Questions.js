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
            question: "Que idade tens?",
            options: [
                "Menos de 13",
                "14-17",
                "18-24",
                "25-32",
                "33-40",
                "Mais de 40"
            ],
        },
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    const currentQuestion = questionData[currentQuestionIndex];

    const handleOptionClick = (index) => {
        setSelectedOption(index);
    };

    const handleNextQuestion = () => {
        if (selectedOption === null) {
            return;
        }

        // Talvez para guardar os dados ?
        console.log(
            `Pergunta: ${currentQuestion.question}, Resposta: ${currentQuestion.options[selectedOption]}`
        );

        // Avançar pergunta OU terminar questionário
        if (currentQuestionIndex < questionData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            console.log("Fim do questionário");
            navigate("/connection");
        }
    };

    return (
        <div className="questions-container">
            <p className="question-title">{currentQuestion.question}</p>
            <p className="question-desc">Seleciona apenas uma opção.</p>
            <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${selectedOption === index ? "selected" : ""}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>
            <button
                className={`continue-button ${selectedOption === null ? "disabled" : ""}`}
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
            >
                Continuar
            </button>
        </div>
    );
};

export default Questions;

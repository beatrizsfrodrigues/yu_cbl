// src/components/TermsModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "../assets/css/termsModal.css";

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <ion-icon name="close-outline" />
        </button>
        <h2>Termos & Privacidade</h2>
        <p className="effective-date">Em vigor desde 18 Junho 2025</p>

        <div className="terms-scroll">
          <details open>
            <summary>Resumo dos Termos</summary>
            <ul>
              <li><strong>Aceitação:</strong> Ao criar conta, concordas com estes Termos e a Privacidade.</li>
              <li><strong>Conta:</strong> Mantém email e password seguras.</li>
              <li><strong>Licença:</strong> Uso limitado; não copiar ou distribuir.</li>
              <li><strong>Conteúdo:</strong> Manténs direitos sobre o que submeteres.</li>
              <li><strong>Conduta:</strong> Sem spam, phishing ou conteúdo ilegal.</li>
              <li><strong>Responsabilidade:</strong> App “tal como está”, sem danos indiretos.</li>
            </ul>
          </details>

          <details>
            <summary>Resumo da Privacidade</summary>
            <ul>
              <li><strong>Dados:</strong> nome, email e histórico de tarefas.</li>
              <li><strong>Uso:</strong> personalização e análises anónimas.</li>
              <li><strong>Armazenamento:</strong> servidores seguros e encriptação.</li>
              <li><strong>Direitos:</strong> aceder, retificar, apagar e exportar dados.</li>
              <li><strong>Sem Marketing:</strong> não partilhamos para marketing.</li>
            </ul>
          </details>

          <p className="note">
            Para ver o texto completo, acede a <em>Definições → Sobre a YU</em>.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal;

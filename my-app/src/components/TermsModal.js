// src/components/TermsModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "../assets/css/termsModal.css";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Termos de Uso & Privacidade</h2>
        <p><strong>Em vigor desde:</strong> 18 de Junho de 2025</p>

        <div className="terms-scroll">
          <h3>Resumo dos Termos</h3>
          <ul>
            <li><strong>Aceitação:</strong> Ao criar conta, concordas com estes Termos e a Política de Privacidade.</li>
            <li><strong>Conta:</strong> Fornece dados verdadeiros e mantém email/password em segurança.</li>
            <li><strong>Licença:</strong> Uso limitado e não exclusivo; proibido copiar ou distribuir o app.</li>
            <li><strong>Conteúdo:</strong> Manténs direitos sobre o que submeteres; cedes à YU licença para uso na plataforma.</li>
            <li><strong>Conduta:</strong> Proibido spam, hacking, phishing ou conteúdo ilegal.</li>
            <li><strong>Responsabilidade:</strong> App fornecida "tal como está"; YU não responde por danos indiretos.</li>
          </ul>

          <h3>Resumo da Privacidade</h3>
          <ul>
            <li><strong>Dados:</strong> nome, email e histórico de tarefas.</li>
            <li><strong>Uso:</strong> personalização e estatísticas anónimas.</li>
            <li><strong>Armazenamento:</strong> servidores seguros e encriptação.</li>
            <li><strong>Direitos:</strong> aceder, retificar, apagar e solicitar portabilidade.</li>
            <li><strong>Sem Marketing:</strong> não partilhamos nem usamos para fins de marketing.</li>
          </ul>

          <p className="privacy-note">
            Para detalhes completos, após o registo acede a <em>Definições → Sobre a YU</em>.
          </p>
        </div>

        <button className="buttonBig active" onClick={() => { onAccept(); onClose(); }}>
          Concordo
        </button>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal;

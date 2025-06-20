// Privacidade.js
import React from "react";
import "../Definicoes/Definicoes.css";

const Privacidade = ({ show = false, onClose = () => {}, onBackToTermos = () => {} }) => {
  if (!show) return null;

  const handleBack = () => {
    onClose();         // fecha este modal
    onBackToTermos();  // reabre o Termos
  };

  return (
     <div className="modal modal-privacidade" onClick={handleBack}>
      <div className="window" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="grafico-header">
            <ion-icon
              name="chevron-back-outline"
              onClick={handleBack}
              className="icons"
              style={{ fontSize: "28px" }}
            />
          <h3>Política de Privacidade da Aplicação YU</h3>
        </div>
        <div className="line" />

        {/* Content */}
        <div className="grafico-content" style={{ textAlign: "justify", textJustify: "inter-word" }}>
          <div className="grafico-section">
            <p>
              A aplicação YU, desenvolvida pelo Grupo 06 no contexto académico da
              Universidade de Aveiro, compromete-se a proteger a privacidade dos seus
              utilizadores e a garantir a utilização ética dos dados recolhidos. Esta política de
              privacidade explica como os dados pessoais são recolhidos, utilizados e protegidos
              durante a utilização da aplicação.
            </p>
          </div>

          <div className="grafico-section">
            <h3>1. Que dados recolhemos</h3>
            <p>
              Recolhemos os seguintes dados pessoais:
              <br />• Nome de utilizador
              <br />• Endereço de email
              <br />• Histórico de tarefas e conexões entre utilizadores
            </p>
          </div>

          <div className="grafico-section">
            <h3>2. Como recolhemos os dados</h3>
            <p>
              Os dados são recolhidos diretamente quando o utilizador:
              <br />• Se regista na aplicação
              <br />• Responde ao questionário inicial
              <br />• Interage com tarefas e funcionalidades sociais
              <br />• Utiliza a aplicação nos diferentes dispositivos
            </p>
          </div>

          <div className="grafico-section">
            <h3>3. Como usamos os dados</h3>
            <p>
              Os dados são utilizados para:
              <br />• Personalização da experiência do utilizador
              <br />• Gestão de tarefas e interações sociais
              <br />• Geração de estatísticas anónimas para melhoria da aplicação
            </p>
            <p>
             <strong>Não utilizamos os dados para fins de marketing nem os partilhamos com terceiros.</strong>
            </p>
          </div>

          <div className="grafico-section">
            <h3>4. Como armazenamos os dados</h3>
            <p>
              Os dados são armazenados em servidores seguros, com acesso restrito e
              encriptação adequada. São mantidos enquanto a conta do utilizador estiver ativa.
              A pedido do utilizador, os dados podem ser eliminados permanentemente.
            </p>
          </div>

          <div className="grafico-section">
            <h3>5. Direitos dos utilizadores</h3>
            <p>
              Os utilizadores têm direito a:
              <br />• Aceder aos seus dados, retificar dados incorretos
              <br />• Solicitar a eliminação dos dados ('direito a ser esquecido')
              <br />• Opor-se ao tratamento dos dados
              <br />• Solicitar portabilidade dos dados
            </p>
            <p>
              Para exercer estes direitos, contacte-nos via email:
            </p>
            <a>yumctw@gmail.com</a>
            <p>Pode também apresentar reclamação à CNPD (www.cnpd.pt).</p>
          </div>

          <div className="grafico-section">
            <h3>6. Política de privacidade de terceiros</h3>
            <p>
              A aplicação YU pode conter ligações para serviços externos (como Google Fonts,
              Chart.js, Adobe Stock). Recomendamos que consulte as respetivas políticas de
              privacidade.
            </p>
          </div>

          <div className="grafico-section">
            <h3>7. Alterações a esta política</h3>
            <p>
              A política de privacidade será atualizada sempre que forem introduzidas novas
              funcionalidades ou alterações relevantes. A versão mais recente estará disponível
              na aplicação.
            </p>
          </div>

          <div className="grafico-section">
            <h3>8. Como contactar a equipa</h3>
            <p>
              <strong>Email:</strong> yumctw@gmail.com
            </p>
          </div>

          <div className="grafico-section">
            <h3>9. Como contactar a autoridade competente</h3>
            <p>
              Se considerar que os seus direitos de proteção de dados foram violados, pode
              contactar a Comissão Nacional de Proteção de Dados (CNPD): www.cnpd.pt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacidade;

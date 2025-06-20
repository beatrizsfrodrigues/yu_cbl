// TermosUso.js
import React from "react";
import "../Definicoes/Definicoes.css";

const TermosUso = ({ show = false, onClose = () => {}, onBackToTermos = () => {} }) => {
  if (!show) return null;

  const handleBack = () => {
    onClose();
    onBackToTermos();
  };

  return (
<div className="modal modal-termos" onClick={onClose}>
  <div className="window" onClick={e => e.stopPropagation()}>
    {/* Header */}
    <div className="settings-header" >
      <ion-icon
        name="chevron-back-outline"
        onClick={handleBack}
        className="icons"
        style={{ fontSize: "28px" }}
      />
      <h3 >Termos de Uso </h3>
    </div>
        <div className="line" />

        {/* Content */}
        <div className="grafico-content" style={{ textAlign: "justify", textJustify: "inter-word" }}>
          {/* 0. Introdução */}
          <div className="grafico-section">
            <p>
              <strong>Data de Vigência:</strong> 18 de Junho de 2025
            </p>
            <p>
              Bem-vindo(a) à aplicação <strong>YU</strong>. Antes de utilizar a nossa
              plataforma, leia cuidadosamente estes Termos de Uso (“Termos”), pois eles
              regem a sua utilização da app e definem os direitos e obrigações entre si
              (“Utilizador”) e a YU.
            </p>
          </div>

          {/* 1. Definições e Âmbito */}
          <div className="grafico-section">
            <h3>1. Definições e Âmbito de Aplicação</h3>
            <p>
              1.1. <strong>App YU</strong>: aplicação mobile e web desenvolvida pelo Grupo 06
              no contexto académico da Universidade de Aveiro.
            </p>
            <p>
              1.2. <strong>Utilizador</strong>: pessoa que acede, regista e utiliza a
              App YU.
            </p>
            <p>
              1.3. <strong>Conteúdo</strong>: todas as informações, textos, imagens, vídeos,
              comentários e dados gerados ou partilhados pelo Utilizador na plataforma.
            </p>
            <p>
              1.4. Estes Termos aplicam-se a todas as versões da App YU (iOS, Android, Web)
              e a quaisquer atualizações ou add-ons.
            </p>
          </div>

          {/* 2. Aceitação */}
          <div className="grafico-section">
            <h3>2. Aceitação dos Termos</h3>
            <p>
              2.1. Ao instalar, aceder ou utilizar a App YU, concorda em ficar vinculado
              por estes Termos e pela nossa Política de Privacidade.
            </p>
            <p>
              2.2. A YU reserva-se o direito de alterar estes Termos a qualquer momento.
              Notificações serão enviadas via e-mail ou in-app. O uso continuado após as
              alterações implica aceitação dos Termos revisados.
            </p>
          </div>

          {/* 3. Elegibilidade */}
          <div className="grafico-section">
            <h3>3. Elegibilidade</h3>
            <p>
              3.1. Só pode usar a App YU se tiver pelo menos 16 anos ou, se for menor,
              com consentimento expresso do tutor ou responsável legal.
            </p>
            <p>
              3.2. Pessoas sem capacidade jurídica ou menores de 16 anos não estão
              autorizados a registar-se ou a utilizar a App.
            </p>
          </div>

          {/* 4. Licença de Utilização */}
          <div className="grafico-section">
            <h3>4. Licença de Utilização</h3>
            <p>
              4.1. Concede-se ao Utilizador uma licença limitada, revogável e não exclusiva
              para usar a App YU em dispositivos compatíveis.
            </p>
            <p>
              4.2. É expressamente proibido copiar, modificar, distribuir, descompilar,
              fazer engenharia inversa ou criar trabalhos derivados da App.
            </p>
          </div>

          {/* 5. Registo e Credenciais */}
          <div className="grafico-section">
            <h3>5. Registo e Credenciais</h3>
            <p>
              5.1. Para aceder a funcionalidades restritas, o Utilizador deve criar uma conta
              com dados verdadeiros e atualizados.
            </p>
            <p>
              5.2. O Utilizador é responsável pela confidencialidade das suas credenciais
              (email e password) e por todas as atividades realizadas na sua conta.
            </p>
          </div>

          {/* 6. Conteúdo do Utilizador */}
          <div className="grafico-section">
            <h3>6. Conteúdo do Utilizador</h3>
            <p>
              6.1. O Utilizador mantém todos os direitos sobre o conteúdo que submete.
            </p>
            <p>
              6.2. Ao submeter Conteúdo, o Utilizador concede à YU uma licença mundial,
              gratuita, irrevogável e sublicenciável para reproduzir, exibir, distribuir e
              criar obras derivadas do Conteúdo, apenas para operação e melhoria da plataforma.
            </p>
            <p>
              6.3. A YU reserva-se o direito de remover ou recusar qualquer Conteúdo que viole
              estes Termos.
            </p>
          </div>

          {/* 7. Restrições de Utilização e Conduta Proibida */}
          <div className="grafico-section">
            <h3>7. Restrições de Utilização e Conduta Proibida</h3>
            <p>
              7.1. É proibido ao Utilizador enviar spam ou mensagens não solicitadas,
              praticar hacking, phishing ou qualquer ato que comprometa a segurança da App,
              divulgar discurso de ódio, violência ou conteúdos ilegais, ou carregar conteúdo
              protegido por direitos de autor sem autorização.
            </p>
            <p>
              7.2. A violação destas regras pode resultar em suspensão ou encerramento imediato
              da conta.
            </p>
          </div>

          {/* 8. Propriedade Intelectual */}
          <div className="grafico-section">
            <h3>8. Propriedade Intelectual</h3>
            <p>
              8.1. Todos os direitos, títulos e interesses sobre a App, logótipos, marca “YU”,
              design, código-fonte e conteúdos originais pertencem à YU ou aos seus licenciadores.
            </p>
            <p>
              8.2. Qualquer uso não autorizado dos direitos de propriedade intelectual da YU
              constitui infração legal.
            </p>
          </div>

          {/* 9. Isenções de Garantia */}
          <div className="grafico-section">
            <h3>9. Isenções de Garantia</h3>
            <p>
              9.1. A App é fornecida “tal como está” e “conforme disponível”, sem garantias de qualquer tipo.
            </p>
            <p>
              9.2. A YU não garante que a App funcione sem interrupções, erros ou esteja livre de vulnerabilidades.
            </p>
          </div>

          {/* 10. Limitação de Responsabilidade */}
          <div className="grafico-section">
            <h3>10. Limitação de Responsabilidade</h3>
            <p>
              10.1. Na máxima extensão permitida por lei, a YU não será responsável por quaisquer danos indiretos,
              lucros cessantes, perda de dados ou outros prejuízos resultantes do uso ou impossibilidade de usar a App.
            </p>
            <p>
              10.2. A responsabilidade total da YU, se for o caso, limita-se ao montante pago pelo Utilizador,
              ou, na ausência de pagamento, a €0.
            </p>
          </div>

          {/* 11. Indemnização */}
          <div className="grafico-section">
            <h3>11. Indemnização</h3>
            <p>
              11.1. O Utilizador concorda em indemnizar, defender e isentar a YU, seus diretores,
              funcionários e licenciadores de quaisquer reclamações, danos, responsabilidades e custos
              decorrentes do uso indevido da App ou violação destes Termos.
            </p>
          </div>

          {/* 12. Suspensão e Rescisão */}
          <div className="grafico-section">
            <h3>12. Suspensão e Rescisão</h3>
            <p>
              12.1. A YU pode suspender ou encerrar a conta do Utilizador a qualquer momento,
              sem aviso prévio, em caso de violação grave destes Termos.
            </p>
            <p>
              12.2. Após rescisão, o acesso ao Conteúdo e aos serviços ficará imediatamente cessado,
              sem que isso implique qualquer reembolso.
            </p>
          </div>

          {/* 13. Alterações aos Termos */}
          <div className="grafico-section">
            <h3>13. Alterações aos Termos</h3>
            <p>
              13.1. A YU poderá rever estes Termos periodicamente. Atualizações serão notificadas via in-app ou e-mail.
            </p>
            <p>
              13.2. Se o Utilizador não concordar com as alterações, deve deixar de usar a App. Caso contrário,
              o uso contínuo após 30 dias da notificação implica aceitação.
            </p>
          </div>

          {/* 14. Links e Integrações de Terceiros */}
          <div className="grafico-section">
            <h3>14. Links e Integrações de Terceiros</h3>
            <p>14.1. A App pode incluir links ou integrações com serviços externos (Google Fonts, Chart.js, Adobe Stock, etc.).</p>
            <p>14.2. A YU não se responsabiliza pelas políticas ou práticas de privacidade desses terceiros.</p>
          </div>

          {/* 15. Privacidade e Cookies */}
          <div className="grafico-section">
            <h3>15. Privacidade e Cookies</h3>
            <p>15.1. O tratamento de dados pessoais do Utilizador é regido pela nossa Política de Privacidade.</p>
            <p>15.2. Utilizamos cookies e tecnologias similares para melhorar a experiência do Utilizador, conforme explicado na Política de Privacidade.</p>
          </div>

          {/* 16. Legislação Aplicável e Foro */}
          <div className="grafico-section">
            <h3>16. Legislação Aplicável e Foro</h3>
            <p>16.1. Estes Termos são regidos pela lei portuguesa.</p>
            <p>16.2. Para resolução de litígios, fica eleito o foro da Comarca de Aveiro, Portugal, com renúncia a qualquer outro.</p>
          </div>

          {/* 17. Contacto */}
          <div className="grafico-section">
            <h3>17. Contacto</h3>
            <p>Para dúvidas, suporte ou reclamações, contacte-nos:</p>
            <p><strong>Email:</strong> yumctw@gmail.com</p>
            <p><strong>Endereço:</strong> Departamento Arte Comunicação e Música, Universidade de Aveiro, 3810-193 Aveiro, Portugal</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TermosUso;

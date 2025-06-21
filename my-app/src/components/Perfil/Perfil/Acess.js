// src/components/Acessibilidade.js

import React, { useEffect, useRef } from "react";
import "../Grafico/grafico.css";
import "./acess.css";

export default function Acessibilidade({ show, onClose }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (show && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [show]);

  if (!show) return null;

  return (
    // Backdrop: fecha o modal ao clicar fora da janela
    <div className="modal" onClick={onClose}>
      {/* Window: bloqueia a propagação do clique para o backdrop */}
      <div className="window" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="grafico-header">
          <h3>Acessibilidade na YU</h3>
          <ion-icon
            name="close-outline"
            onClick={onClose}
            className="icons"
            style={{ fontSize: "28px" }}
          />
        </div>
        <div className="line" />

        {/* Conteúdo */}
        <div className="grafico-content" ref={contentRef}>
          <div className="grafico-section">
            <h3>Declaração de Acessibilidade</h3>
            <p>
              <strong>Última atualização:</strong> 6 de junho de 2025
            </p>
            <p>
              <strong>Período de verificação:</strong> 24 de março a 3 de junho de
              2025
            </p>
          </div>

          <div className="grafico-section">
            <h3>1. Nível de Conformidade</h3>
            <p>
              A aplicação YU foi avaliada segundo as boas práticas para PWAs e as
              diretrizes <strong>WCAG 2.1</strong> e atinge atualmente o nível de
              conformidade <strong>AA</strong>.
            </p>
          </div>

          <div className="grafico-section">
            <h3>2. Ferramentas e Metodologia de Teste</h3>
            <p>
              <strong>Testes automáticos:</strong>
              <br />• Lighthouse (performance e acessibilidade)
              <br />• WAVE e Axe (validação de acessibilidade)
            </p>
            <p>
              <strong>Avaliação manual:</strong>
              <br />• Inspeção semântica do HTML e atributos ARIA
            </p>
            <p>
              <strong>Análise de performance/responsividade:</strong>
              <br />• DevTools do browser
            </p>
          </div>

          <div className="grafico-section">
            <h3>3. Restrições Conhecidas</h3>
            <p>
              • Responsividade parcial: algumas vistas em dispositivos móveis ainda
              carecem de pequenos ajustes de layout.
            </p>
          </div>

          <div className="grafico-section">
            <h3>4. Melhoria Contínua</h3>
            <p>
              Mantemos um plano de monitorização contínua com testes regulares
              (Lighthouse, WAVE, Axe e DevTools) e revisões trimestrais para garantir
              que novos conteúdos e funcionalidades se mantenham acessíveis.
            </p>
          </div>

          <div className="grafico-section">
            <h3>5. Contacto</h3>
            <p>
              Se encontrar alguma barreira de acessibilidade ou tiver sugestões de
              melhoria, por favor contacte-nos em:
            </p>
            <p>
              <a className="acess-link" href="mailto:yumctw@gmail.com">
                yumctw@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

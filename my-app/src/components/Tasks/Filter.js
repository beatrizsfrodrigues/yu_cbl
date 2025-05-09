import React, { useEffect, useRef, useCallback } from "react";

function Filter({ filterCriteria, onFilterChange, onClose }) {
  const popupRef = useRef(null);

  const handleFilterClick = (criteria) => {
    onFilterChange(criteria);
    onClose();
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div id="filter" ref={popupRef}>
      <button
        aria-label="Mostrar todas as tarefas"
        className={`submitBtn ${
          filterCriteria === "todas" ? "activeFilter" : ""
        }`}
        onClick={() => handleFilterClick("todas")}
      >
        Todas
      </button>
      <button
        aria-label="Mostrar todas as tarefas por concluir"
        className={`submitBtn ${
          filterCriteria === "porConcluir" ? "activeFilter" : ""
        }`}
        onClick={() => handleFilterClick("porConcluir")}
      >
        Por Concluir
      </button>
      <button
        aria-label="Mostrar todas as tarefas concluidas"
        className={`submitBtn ${
          filterCriteria === "concluidas" ? "activeFilter" : ""
        }`}
        onClick={() => handleFilterClick("concluidas")}
      >
        Concluidas
      </button>

      <button
        aria-label="Mostrar todas as tarefas em lista de espera"
        className={`submitBtn ${
          filterCriteria === "espera" ? "activeFilter" : ""
        }`}
        onClick={() => handleFilterClick("espera")}
      >
        Em lista de espera
      </button>
    </div>
  );
}

export default Filter;

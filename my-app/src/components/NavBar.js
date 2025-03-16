import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home as HomeIcon, Clipboard, User } from "react-feather";
import "../assets/css/NavBar.css";

function NavBar() {
  // Memoriza o array navItems para evitar recriações desnecessárias
  const navItems = useMemo(
    () => [
      { path: "/home", icon: <HomeIcon strokeWidth={2.5} />, label: "Home" },
      {
        path: "/tasks",
        icon: <Clipboard strokeWidth={2.5} />,
        label: "Tarefas",
      },
      { path: "/profile", icon: <User strokeWidth={2.5} />, label: "Perfil" },
    ],
    []
  );

  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location, navItems]);

  return (
    <nav>
      <div
        className="indicator"
        style={{
          transform: `translateX(${activeIndex * 80 - 80}px) translateY(-70%)`,
        }}
      />

      {navItems.map((item, index) => (
        <NavLink
          aria-label="Botão de navegação"
          key={item.path}
          to={item.path}
          size={60}
          className={`navItem ${activeIndex === index ? "active" : ""}`}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavBar;

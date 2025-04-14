import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
// import {
//   Home as HomeIcon,
//   Clipboard,
//   User,
//   MessageCircle,
// } from "react-feather";
import "../assets/css/NavBar.css";

function NavBar() {
  // Memoriza o array navItems para evitar recriações desnecessárias
  const navItems = useMemo(
    () => [
      {
        path: "/home",
        icon: (
          <ion-icon
            name="home-outline"
            className="iconsNav"
            size="large"
          ></ion-icon>
        ),
        label: "Home",
      },
      {
        path: "/tasks",
        icon: (
          <ion-icon
            name="clipboard-outline"
            className="iconsNav"
            size="large"
          ></ion-icon>
        ),
        label: "Tarefas",
      },
      {
        path: "/messages",
        icon: (
          <ion-icon
            name="chatbubble-ellipses-outline"
            className="iconsNav"
            size="large"
          ></ion-icon>
        ),
        label: "Mensagens",
      },
      {
        path: "/profile",
        icon: (
          <ion-icon
            name="person-outline"
            className="iconsNav"
            size="large"
          ></ion-icon>
        ),
        label: "Perfil",
      },
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

  const ITEM_WIDTH = 70;
  const OFFSET = (navItems.length * ITEM_WIDTH) / 2;

  return (
    <nav aria-label="Menu de navegação principal">
      <button
        className="indicator"
        style={{
          transform: `translateX(${
            activeIndex * ITEM_WIDTH - OFFSET + ITEM_WIDTH / 2
          }px) translateY(-70%)`,
        }}
      />

      {navItems.map((item, index) => (
        <NavLink
          aria-label={`Ir para ${item.label}`}
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

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import "../assets/css/NavBar.css";

function NavBar() {
  const hasUnreadMessages = useSelector(
    (state) => state.messages.hasUnreadMessages
  );

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
          <div>
            <ion-icon
              name="chatbubble-ellipses-outline"
              className="iconsNav"
              size="large"
            ></ion-icon>
            {hasUnreadMessages && <span className="messageBadge" />}
          </div>
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
    [hasUnreadMessages],
    []
  );

  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(80); // Default for desktop

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location, navItems]);

  useEffect(() => {
    const updateItemWidth = () => {
      if (window.innerWidth <= 768) {
        setItemWidth(70); // Mobile
      } else {
        setItemWidth(80); // Desktop
      }
    };

    updateItemWidth(); // Set initial value
    window.addEventListener("resize", updateItemWidth);

    return () => {
      window.removeEventListener("resize", updateItemWidth);
    };
  }, []);

  const indicatorTransform = useMemo(() => {
    const totalItems = navItems.length;
    const navWidth = totalItems * itemWidth;
    const centerOffset = navWidth / 2 - itemWidth / 2;
    const targetX = activeIndex * itemWidth - centerOffset;
    return `translateX(${targetX}px) translateY(-70%)`;
  }, [activeIndex, itemWidth, navItems.length]);

  return (
    <nav aria-label="Menu de navegação principal">
      <button
        className="indicator"
        style={{
          transform: indicatorTransform,
        }}
        aria-label="indicador de navegação"
      />

      {navItems.map((item, index) => (
        <NavLink
          aria-label={`Ir para ${item.label}`}
          key={item.path}
          to={item.path}
          className={`navItem ${activeIndex === index ? "active" : ""}`}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavBar;

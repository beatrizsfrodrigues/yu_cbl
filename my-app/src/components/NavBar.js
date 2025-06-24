import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../redux/messagesSlice";
import { getAuthUser } from "../utils/storageUtils";
import { selectHasUnseenMessages } from "../redux/messagesSlice";
import { NavLink, useLocation } from "react-router-dom";
import "../assets/css/NavBar.css";

function NavBar() {
  const dispatch = useDispatch();
  const authUser = getAuthUser();
  const hasUnreadMessages = useSelector((state) =>
    selectHasUnseenMessages(state, authUser?._id)
  );

  // Polling para atualizar mensagens a cada 5 segundos
  useEffect(() => {
    if (!authUser?._id) return;
    const interval = setInterval(() => {
      dispatch(getMessages({ userId: authUser._id, page: 1, limit: 5 }));
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [authUser?._id, dispatch]);

  console.log("hasUnreadMessages:", hasUnreadMessages);

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
          <div style={{ position: "relative", display: "inline-block" }}>
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
      if (window.innerWidth <= 450) {
        console.log("Mobile view detected");
        console.log(window.innerWidth - window.innerWidth / 1.2);
        setItemWidth(window.innerWidth - window.innerWidth / 1.21); // Mobile
      } else {
        console.log("Desktop view detected");
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

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home as HomeIcon, Clipboard, User } from "react-feather";
import "../assets/css/NavBar.css";

function NavBar() {
  const navItems = [
    { path: "/",       icon: <HomeIcon />, label: "Home" },
    { path: "/tasks",  icon: <Clipboard />, label: "Tarefas" },
    { path: "/profile",icon: <User />,     label: "Perfil" },
  ];
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location, navItems]);

  return (
    <nav>
      <div
        className="indicator"
        style={{
            transform: `translateX(${activeIndex * 80 + 5}px) translateY(-70%)`,
        }}
      />

      {navItems.map((item, index) => (
        <NavLink
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

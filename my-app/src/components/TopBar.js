import React from "react";

const TopBar = ({ title, children }) => {
  return (
    <header className="topBar">
      <div className="menu">
        <div className="userPhoto"></div>
        <h1 className="topBar-title">{title}</h1>
        {children}
      </div>
    </header>
  );
};

export default TopBar;

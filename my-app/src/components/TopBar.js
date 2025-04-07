import React from "react";

const TopBar = ({ title, children }) => {
  return (
    <header className="topBar">
      <div className="menu">
        <h1 className="topBar-title">{title}</h1>
        {children}
      </div>
      <div className="userPhoto"></div>
    </header>
  );
};

export default TopBar;

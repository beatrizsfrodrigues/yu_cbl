
import React from "react";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";

const TopBar = ({ title, children }) => {

  const authUser           = useSelector(state => state.user.authUser);
  const equippedAccessories = useSelector(state => state.user.equippedAccessories);
  const allAccessories     = useSelector(state => state.accessories.data);
  const mascot = authUser?.mascot;

  return (
    <header className="topBar">
      <div className="menu">
        <div className="userPhoto">
          <Avatar
           mascot={mascot}
           equipped={equippedAccessories}
           accessoriesList={allAccessories}
            size={48}
            accScale={0.7}      
          accOffsetX={-9}     
          accOffsetY={-7}     
          />
        </div>
        <h1 className="topBar-title">{title}</h1>
        {children}
      </div>
    </header>
  );
};

export default TopBar;

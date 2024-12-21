import React from 'react';
import '../assets/css/closet.css';
import { Circle } from "react-feather";

const Closet = () => {
  return (
    <div className="avatareditor">
      <div className="avatarheader">
        <p className="icons"><Circle/></p>
        <p className="icons">Icon2</p>
        <p className="icons">Icon3</p>
        <p className="icons">Icon4</p>
      </div>

      <hr className="divider"></hr>

    <div className="avatarcontent">
      <div className="avatarcircle"></div>
      <div className="avatarcircle"></div>
    </div>  
    </div>
  );
};

export default Closet;

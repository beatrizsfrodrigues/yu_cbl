import React from 'react';
import '../../assets/css/closet.css';
import { Circle } from "react-feather";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Closet = () => {
  return (
    <div className="closetContainer">
      <div className="avatareditor">
        <div className="avatarheader">
          <p className="icons">
            <Circle />
          </p>
          <p className="icons">
            <i className="bi bi-backpack"></i> {/* bag icon */}
          </p>
          <p className="icons">
            <i className="bi bi-smartwatch"></i> {/* watch icon */}
          </p>
          <p className="icons">
            <i className="bi bi-image-fill"></i> {/* Mountains icon */}
          </p>
        </div>

        <hr className="divider"></hr>

        <div className="avatarcontent">
          <div className="avatarcircle"></div>
          <div className="avatarcircle"></div>
          <div className="avatarcircle"></div>
          <div className="avatarcircle"></div>
        </div>
      </div>

      <div className="closetFooter"></div>
    </div>
  );
};

export default Closet;

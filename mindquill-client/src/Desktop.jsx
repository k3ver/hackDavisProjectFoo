import React from "react";
// import { Rectangle } from "./Rectangle";
import mindquill1 from "./images/mindquill-1.png";
import rectangle1 from "./images/rectangle-1.svg";
import "./style.css";

export const Desktop = () => {
  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />

          <p className="text-wrapper">
            Drag or drop pdf file below to begin your learning!
          </p>

          <img className="mindquill" alt="Mindquill" src={mindquill1} />

          <p className="text-wrapper">
            Drag or drop pdf file below to begin your learning!
          </p>

          <div className="frame">
            <div className="text-wrapper-2">About</div>

            <div className="text-wrapper-2">Progress</div>
          </div>

          <div className="div-wrapper">
            <div className="text-wrapper-2">Sign Up</div>
          </div>
        </div>

        <div className="rectangle-2" />

        <div className="rectangle-3" />
        <div className="frame-2">
          <div className="ellipse" />

          <div className="text-wrapper-3">Quiz</div>
        </div>

        <div className="frame-3">
          <div className="ellipse" />

          <div className="text-wrapper-3">Text</div>
        </div>
      </div>
    </div>
  );
};


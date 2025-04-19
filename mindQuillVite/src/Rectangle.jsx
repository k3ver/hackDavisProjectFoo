// src/Rectangle.jsx

import React from "react";
import "./style.css"; // or wherever your styles are defined

export const Rectangle = ({ className = "" }) => {
  return <div className={`rectangle ${className}`}></div>;
};


import React from "react";
import "./componentStyles/Shape.scss";
function Shape({ shapeName, shapeColor }) {
  return <div className={`shape-size ${shapeName} ${shapeColor}`}></div>;
}

export default Shape;

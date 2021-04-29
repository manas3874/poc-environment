import React, { useState, useEffect, useRef } from "react";
import "./componentStyles/GsapToTesting.scss";

import gsap from "gsap";

function GsapToTesting() {
  const sliderRef = useRef(null);
  const myTweenRef = useRef(null);
  useEffect(() => {
    // ! Ref to store the tween
    myTweenRef.current = gsap.fromTo(
      sliderRef.current,
      { x: 0 },
      { x: 500 - 20, ease: "linear", duration: 1, repeat: 5, paused: true }
    );
  }, []);
  // ! Function to change the duration of tween based on BPM
  const changeDuration = (newDuration) => {
    myTweenRef.current.duration(newDuration);
  };
  return (
    <>
      <div className="wrapper">
        <div className="slider" ref={sliderRef}></div>
      </div>
      <button onClick={() => myTweenRef.current.play()}>Start</button>
      <button onClick={() => myTweenRef.current.resume()}>Play</button>
      <button onClick={() => myTweenRef.current.pause()}>Pause</button>
      <button onClick={() => changeDuration(2)}>change duration</button>
    </>
  );
}

export default GsapToTesting;

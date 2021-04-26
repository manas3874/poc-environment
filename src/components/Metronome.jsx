import React, { useState, useEffect, useRef } from "react";
import "./componentStyles/Metronome.scss";
// ! assets import
import play from "../assets/play-button.svg";
import pause from "../assets/pause-button.svg";
// ! gsap imports
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import DropDown from "./DropDown";
gsap.registerPlugin(Draggable);
// ***************************************************************************
// var myTween;
function Metronome() {
  // ! State to maintain the BPM
  const [bpm, setBpm] = useState(50);
  // ! Refs for the slider target and container
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  // ! Ref to maintain the time of seeker as per the BPM
  const graphRef = useRef(null);
  const seekerRef = useRef(null);
  const [myTween, setMyTween] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  // ! funtion to run the seeker based on time input
  const seekHandler = (animationDuration, pausedStatus = false) => {
    // ! repeats 20 times. Can be dynamic dependent on the music instructor
    const tween = gsap.fromTo(
      seekerRef.current,
      { x: 0 },
      {
        x: 554,
        duration: animationDuration,
        repeat: 20,
        ease: "linear",
        paused: pausedStatus,
      }
    );
    return tween;
  };
  useEffect(() => {
    setMyTween(seekHandler(240 / bpm));
    // ! Creating the draggable component
    Draggable.create(sliderRef.current, {
      type: "x",
      bounds: sliderContainerRef.current,
      // ! Snaps in increment of 10 px (increases the BPM by 5 at a time)
      liveSnap: {
        x: function (value) {
          return Math.round(value / 10) * 10;
        },
      },
      // ! While dragging, update the state with the current BPM
      onDrag: function () {
        console.log(this.x / 2 + 50);
        // ! set the BPM on the state
        setBpm(this.x / 2 + 50);
      },

      onDragEnd: function () {
        // ! update the speed of seeker
        setMyTween(seekHandler(240 / (this.x / 2 + 50)));
      },
    });
  }, []);
  useEffect(() => {
    Draggable.create(sliderRef.current, {
      type: "x",
      bounds: sliderContainerRef.current,
      // ! Snaps in increment of 10 px (increases the BPM by 5 at a time)
      liveSnap: {
        x: function (value) {
          return Math.round(value / 10) * 10;
        },
      },
      // ! While dragging, update the state with the current BPM
      onDrag: function () {
        console.log(this.x / 2 + 50);
        // ! set the BPM on the state
        setBpm(this.x / 2 + 50);
      },

      onDragEnd: function () {
        // ! update the speed of seeker
        setMyTween(seekHandler(240 / (this.x / 2 + 50)));
      },
    });
  }, [isPlaying]);
  return (
    <div className="metronome__wrapper">
      <h1 className="metronome__header">Metronome player POC</h1>
      <section className="metronome__octaves">
        <div className="metronome__octaves--list">
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Do" />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Re" />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Mi" />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Fa" />
          </div>
        </div>
        <div className="metronome__octaves--graph" ref={graphRef}>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="seeker-bar" ref={seekerRef}></div>
        </div>
      </section>
      <section className="metronome__control">
        <div className="slider-container" ref={sliderContainerRef}>
          <div className="slider-target" ref={sliderRef}>
            <h1 className="bpm-level">{bpm} BPM</h1>
          </div>
        </div>
        <div className="metronome__control--play-pause">
          {isPlaying ? (
            <img
              src={pause}
              alt="pause"
              className="play-btn"
              onClick={() => {
                myTween.pause();
                setIsPlaying(false);
              }}
            />
          ) : (
            <img
              src={play}
              alt="play"
              className="play-btn"
              onClick={() => {
                myTween.play();
                setIsPlaying(true);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default Metronome;

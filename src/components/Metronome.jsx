import React, { useState, useEffect, useRef } from "react";
import "./componentStyles/Metronome.scss";
// ! assets import
import play from "../assets/play-button.svg";
import pause from "../assets/pause-button.svg";
// ! Audio imports
// import C from "../assets/sound-samples/C.wav";
// import D from "../assets/sound-samples/D.wav";
// import E from "../assets/sound-samples/E.wav";
// import F from "../assets/sound-samples/F.wav";
// import G from "../assets/sound-samples/G.wav";
// import A from "../assets/sound-samples/A.wav";
// import B from "../assets/sound-samples/B.wav";
// ! kicks
import C from "../assets/sound-samples/Kick_1.WAV";
import D from "../assets/sound-samples/Kick_2.WAV";
import E from "../assets/sound-samples/Kick_3.wav";
import F from "../assets/sound-samples/Kick_4.wav";
import G from "../assets/sound-samples/Kick_5.wav";
import A from "../assets/sound-samples/Kick_6.wav";
import B from "../assets/sound-samples/Kick_7.wav";
// ! gsap imports
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import DropDown from "./DropDown";
gsap.registerPlugin(Draggable);
// ***************************************************************************

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
  const [isPlaying, setIsPlaying] = useState(false);
  // ! funtion to run the seeker based on time input
  const seekHandler = (animationDuration, pausedStatus = true) => {
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
        myTween.kill();
        // ! update the speed of seeker
        setMyTween(seekHandler(240 / (this.x / 2 + 50)));
        clearInterval(playInterval);
        playMetronome(
          [
            sampleRefB.current,
            sampleRefC.current,
            sampleRefB.current,
            sampleRefC.current,
          ],
          240 / (this.x / 2 + 50)
        );
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
        if (myTween) myTween.kill();
        // ! update the speed of seeker
        setMyTween(seekHandler(240 / (this.x / 2 + 50)));
      },
    });
  }, [isPlaying]);

  // ! For the audio
  const sampleRefC = useRef(null);
  const sampleRefD = useRef(null);
  const sampleRefE = useRef(null);
  const sampleRefF = useRef(null);
  const sampleRefG = useRef(null);
  const sampleRefA = useRef(null);
  const sampleRefB = useRef(null);
  // ! Mapping notes to samples
  const noteMap = {
    Do: sampleRefC,
    Re: sampleRefD,
    Mi: sampleRefE,
    Fa: sampleRefF,
    So: sampleRefG,
    La: sampleRefA,
    Ti: sampleRefB,
  };
  var playInterval;
  // ! Function to play sounds based on BPM
  const playMetronome = (notesArray, timeForSingleLoop) => {
    if (playInterval) clearInterval(playInterval);
    setTimeout(() => {
      notesArray[1].play();
      playInterval = setInterval(() => {
        notesArray[1].currentTime = 0;
        notesArray[1].play();
      }, (timeForSingleLoop / 4) * 1000);
    }, 600);
  };
  return (
    <div className="metronome__wrapper">
      <h1 className="metronome__header">Metronome player POC</h1>
      <section className="metronome__octaves">
        <div className="metronome__octaves--list">
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Do" position={0} />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Re" position={1} />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Mi" position={2} />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown defaultNote="Fa" position={3} />
          </div>
          <div></div>
          <div></div>
        </div>
        <div className="metronome__octaves--graph" ref={graphRef}>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar"></div>
          <div className="small-bar"></div>
          <div className="large-bar large-bar-red"></div>
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
                playMetronome(
                  [
                    sampleRefB.current,
                    sampleRefC.current,
                    sampleRefB.current,
                    sampleRefC.current,
                  ],
                  240 / bpm
                );
              }}
            />
          )}
        </div>
      </section>
      <audio src={C} ref={sampleRefC}></audio>
      <audio src={D} ref={sampleRefD}></audio>
      <audio src={E} ref={sampleRefE}></audio>
      <audio src={F} ref={sampleRefF}></audio>
      <audio src={G} ref={sampleRefG}></audio>
      <audio src={A} ref={sampleRefA}></audio>
      <audio src={B} ref={sampleRefB}></audio>
      <div className="btn-group">
      
        <button
          onClick={() => {
            sampleRefC.current.currentTime = 0;
            sampleRefC.current.play();
          }}
        >
          Play sound C
        </button>
        <button
          onClick={() => {
            sampleRefD.current.currentTime = 0;
            sampleRefD.current.play();
          }}
        >
          Play sound D
        </button>
        <button
          onClick={() => {
            sampleRefE.current.currentTime = 0;
            sampleRefE.current.play();
          }}
        >
          Play sound E
        </button>
        <button
          onClick={() => {
            sampleRefF.current.currentTime = 0;
            sampleRefF.current.play();
          }}
        >
          Play sound F
        </button>
        <button
          onClick={() => {
            sampleRefG.current.currentTime = 0;
            sampleRefG.current.play();
          }}
        >
          Play sound G
        </button>
        <button
          onClick={() => {
            sampleRefA.current.currentTime = 0;
            sampleRefA.current.play();
          }}
        >
          Play sound A
        </button>
        <button
          onClick={() => {
            sampleRefB.current.currentTime = 0;
            sampleRefB.current.play();
          }}
        >
          Play sound B
        </button>
      </div>
    </div>
  );
}

export default Metronome;

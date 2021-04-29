import React, { useState, useEffect, useRef } from "react";
// ! ToneJS import
import * as Tone from "tone";
// ! Styling import
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
function Metronome() {
  // ! State to maintain the BPM
  const [bpm, setBpm] = useState(50);
  // ! Refs for the slider target and container
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  // ! Ref to maintain the time of seeker as per the BPM
  const graphRef = useRef(null);
  const seekerRef = useRef(null);
  const myTweenRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    myTweenRef.current = gsap.fromTo(
      seekerRef.current,
      { x: 0 },
      {
        x: 554,
        duration: 4.8,
        repeat: 40,
        ease: "linear",
        paused: true,
      }
    );
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
        myTweenRef.current.duration(240 / (this.x / 2 + 50));
        Tone.Transport.bpm.rampTo(this.x / 2 + 50, 0.5);
      },
    });
  }, []);
  // ! ***************************************************** for sound
  // ! Mapping notes to samples
  const [noteMap, setNoteMap] = useState({
    1: "C1",
    2: "Db3",
    3: "E1",
    4: "F#3",
  });

  const changeNoteMap = (position, frequency) => {
    let dummyObj = noteMap;
    dummyObj[position] = frequency;
    setNoteMap(dummyObj);
  };
  // ! ToneJS
  let synth,
    step,
    index = 0;

  // ! Initial BPM
  Tone.Transport.bpm.value = bpm;
  const playSound = () => {
    // ! Can change the synth
    synth = new Tone.MembraneSynth().toDestination();
    // synth.sync();
    synth.volume.value = -10;
    Tone.Transport.scheduleRepeat(repeat, "4n");
    Tone.Transport.start();
    // synth.sync();
  };
  function repeat(time) {
    step = index % 4;
    console.log(step);
    //   ! For solid array
    synth.triggerAttackRelease(noteMap[step + 1], "16n", time);
    index++;
  }

  // ! Play function
  const PlayMetronome = () => {
    myTweenRef.current.play();
    setIsPlaying(true);
    playSound();
  };
  // ! Resume function
  const resumeMetronome = () => {
    myTweenRef.current.resume();
    Tone.Transport.start();
  };
  // ! Pause function
  const pauseMetronome = () => {
    myTweenRef.current.pause();
    Tone.Transport.pause();
  };
  return (
    <div className="metronome__wrapper">
      <h1 className="metronome__header">Metronome player POC</h1>
      <section className="metronome__octaves">
        <div className="metronome__octaves--list">
          <div className="metronome__octaves--list-item">
            <DropDown
              defaultNote="Do"
              position={1}
              defaultFreq="C1"
              makeChange={changeNoteMap}
            />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown
              defaultNote="Re"
              position={2}
              defaultFreq="Db3"
              makeChange={changeNoteMap}
            />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown
              defaultNote="Mi"
              position={3}
              defaultFreq="E1"
              makeChange={changeNoteMap}
            />
          </div>
          <div className="metronome__octaves--list-item">
            <DropDown
              defaultNote="Fa"
              position={4}
              defaultFreq="F#3"
              makeChange={changeNoteMap}
            />
          </div>
        </div>
        <div className="metronome__octaves--graph" ref={graphRef}>
          <span className="large-bar"></span>
          <span className="small-bar"></span>
          <span className="large-bar"></span>
          <span className="small-bar"></span>
          <span className="large-bar"></span>
          <span className="small-bar"></span>
          <span className="large-bar"></span>
          <span className="small-bar"></span>
          <span className="large-bar large-bar-red"></span>
          <span className="seeker-bar" ref={seekerRef}></span>
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
                // ! pause the playback
                setIsPlaying(false);
                pauseMetronome();
              }}
            />
          ) : (
            <img
              src={play}
              alt="play"
              className="play-btn"
              onClick={() => {
                // ! resume the playback
                setIsPlaying(true);
                resumeMetronome();
              }}
            />
          )}
        </div>
      </section>
      <button onClick={PlayMetronome}>Start</button>
    </div>
  );
}

export default Metronome;

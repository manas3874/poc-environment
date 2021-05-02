import React, { useState, useEffect, useRef } from "react";
import "./componentStyles/Sequencer.scss";
import * as Tone from "tone";
// ! assets import
import play from "../assets/play-button.svg";
import pause from "../assets/pause-button.svg";
// ! gsap imports
import gsap from "gsap";
import Draggable from "gsap/Draggable";
gsap.registerPlugin(Draggable);
function Sequencer() {
  // ! GSAP stuff
  const myTweenRef = useRef(null);
  useEffect(() => {
    myTweenRef.current = gsap.fromTo(
      seekerRef.current,
      { x: 0 },
      {
        x: 720,
        duration: 9.6,
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
        setBpm(this.x / 2 + 50);
        myTweenRef.current.duration(480 / (this.x / 2 + 50));
        // Tone.Transport.bpm.rampTo(this.x / 2 + 50, 0.5);
        Tone.Transport.bpm.value = this.x / 2 + 50;
      },
    });
  }, []);
  // ! State to maintain the BPM
  const [bpm, setBpm] = useState(50);
  // ! For the checkbox grid
  const gridRef1 = useRef(null);
  const gridRef2 = useRef(null);
  const gridRef3 = useRef(null);
  const tracks = useRef(null);
  useEffect(() => {
    tracks.current = [
      Array.from(gridRef1.current.children),
      Array.from(gridRef2.current.children),
      Array.from(gridRef3.current.children),
    ];
  }, []);
  // ! ToneJS
  let synths,
    step,
    index = 0,
    chunks = [];
  Tone.Transport.bpm.value = bpm;
  // ! Recorder
  const recorderRef = useRef(null);
  const destRef = useRef(null);
  useEffect(() => {
    const actx = Tone.context;
    destRef.current = actx.createMediaStreamDestination();
    recorderRef.current = new MediaRecorder(destRef.current.stream);
  }, []);
  // recorder.start();
  let stopFunc = () => {
    console.log("stopping");
    recorderRef.current.stop();
  };
  // ! Player
  const playSound = (synthsArr) => {
    recorderRef.current.start();
    synths = synthsArr;
    synths.forEach((synth) => {
      synth.toDestination();
      synth.volume.value = -10;
    });
    Tone.Transport.scheduleRepeat(repeat, "4n");
    recorderRef.current.ondataavailable = (evt) => chunks.push(evt.data);
    recorderRef.current.onstop = (evt) => {
      console.log(chunks);
      let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.download = "recording.mp3";
      anchor.href = url;
      anchor.click();
    };

    Tone.Transport.start();
    console.dir(recorderRef.current);
  };

  // ! for metronome application
  function repeat(time) {
    // ! number of checkboxes in a track
    step = index % 8;
    for (let i = 0; i < 3; i++) {
      if (tracks.current[i][step].checked) {
        console.log(`hitting from synth ${i + 1}`);
        synths[0].triggerAttackRelease(
          tracks.current[i][step].name,
          "4n",
          time
        );
        switch (i + 1) {
          case 1:
            visualizerTimeline1.current.to(visualizer1.current, {
              x: 0,
              scaleX: 1.5,
              // width: 100,
              duration: 0.1,
            });
            visualizerTimeline1.current.to(visualizer1.current, {
              x: 1,
              scale: 1,
              // width: 20,
              duration: 0.1,
            });
            break;
          case 2:
            visualizerTimeline2.current.to(visualizer2.current, {
              x: 50,
              duration: 0.2,
            });
            visualizerTimeline2.current.to(visualizer2.current, {
              x: 0,
              duration: 0.2,
            });
            break;
          case 3:
            visualizerTimeline3.current.to(visualizer3.current, {
              rotate: 180,
              duration: 0.2,
            });
            visualizerTimeline3.current.to(visualizer3.current, {
              rotate: 360,
              duration: 0.2,
            });
            break;
          default:
            break;
        }
      }
    }
    index++;
  }
  // ! Refs for the slider target and container
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const seekerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
  // ! Refs for visualization
  const visualizer1 = useRef(null);
  const visualizer2 = useRef(null);
  const visualizer3 = useRef(null);
  const visualizerTimeline1 = useRef(null);
  const visualizerTimeline2 = useRef(null);
  const visualizerTimeline3 = useRef(null);
  useEffect(() => {
    visualizerTimeline1.current = gsap.timeline();
    visualizerTimeline2.current = gsap.timeline();
    visualizerTimeline3.current = gsap.timeline();
  }, []);
  return (
    <>
      <div className="sequencer-wrapper">
        <h1>Step Sequencer POC</h1>
        <div className="notes-grid-parent">
          <div className="sequence-slider" ref={seekerRef}></div>
          <div className="visualizer-wrapper">
            <div className="visualizer-1 visualizer" ref={visualizer1}></div>
            <div className="visualizer-2 visualizer" ref={visualizer2}></div>
            <div className="visualizer-3 visualizer" ref={visualizer3}></div>
          </div>
          <div className="notes-grid" ref={gridRef1}>
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
            <input type="checkbox" className="note-checkbox" name="A1" />
          </div>
          <div className="notes-grid" ref={gridRef2}>
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
            <input type="checkbox" className="note-checkbox" name="B4" />
          </div>
          <div className="notes-grid" ref={gridRef3}>
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
            <input type="checkbox" className="note-checkbox" name="G3" />
          </div>
        </div>
        <div className="control">
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
        </div>
      </div>

      <button
        onClick={() => {
          myTweenRef.current.play();
          setIsPlaying(true);

          playSound([
            new Tone.MembraneSynth().connect(destRef.current),
            new Tone.MembraneSynth().connect(destRef.current),
            new Tone.MembraneSynth().connect(destRef.current),
          ]);
        }}
      >
        start
      </button>
      <button onClick={stopFunc}>Stop recording</button>
    </>
  );
}

export default Sequencer;

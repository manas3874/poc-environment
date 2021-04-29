import React, { useState, useEffect, useRef } from "react";
import "./componentStyles/Sequencer.scss";
import * as Tone from "tone";
// ! material UI imports
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
// ! assets import
import play from "../assets/play-button.svg";
import pause from "../assets/pause-button.svg";
// ! gsap imports
import gsap from "gsap";
import Draggable from "gsap/Draggable";
gsap.registerPlugin(Draggable);
// ***************************************************************************
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  label: { fontSize: "20px", transform: "translateY(-10px)" },
  menuItem: { fontSize: "16px", border: "none" },
}));
// ***************************************************************************
function Sequencer() {
  // ! changing the synths from dropdown
  //   const [synth, setSynth] = useState("Membrane");
  //   const updateSynth = (event, track) => {
  //     console.log(event.target.value);
  //     setSynth(event.target.value);
  //     Tone.Transport.stop(0);
  //     switch (event.target.value) {
  //       case "Membrane":
  //         synths[track] = new Tone.MembraneSynth().toDestination();
  //         break;
  //       case "Pluck":
  //         synths[track] = new Tone.PluckSynth().toDestination();
  //         break;
  //       case "Metal":
  //         synths[track] = new Tone.MetalSynth().toDestination();
  //         break;
  //       default:
  //         break;
  //     }
  //     console.log(synths);
  //     // Tone.Transport.scheduleRepeat(repeat, "4n");
  //     Tone.Transport.start();
  //   };
  //   const classes = useStyles();
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
    index = 0;
  Tone.Transport.bpm.value = bpm;
  const playSound = (synthsArr) => {
    synths = synthsArr;
    synths.forEach((synth) => (synth.volume.value = -10));
    Tone.Transport.scheduleRepeat(repeat, "4n");
    Tone.Transport.start();
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

  return (
    <>
      <div className="sequencer-wrapper">
        <h1>Step Sequencer POC</h1>
        <div className="notes-grid-parent">
          <div className="sequence-slider" ref={seekerRef}></div>
          <div className="notes-grid" ref={gridRef1}>
            {/* <FormControl className={classes.formControl}>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={synth}
              onChange={(event) => updateSynth(event, 0)}
              displayEmpty
              className={classes.menuItem}
            >
              <MenuItem value="Membrane" className={classes.menuItem}>
                Membrane
              </MenuItem>
              <MenuItem value="Pluck" className={classes.menuItem}>
                Pluck
              </MenuItem>
              <MenuItem value="Metal" className={classes.menuItem}>
                Metal
              </MenuItem>
            </Select>
          </FormControl> */}
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
            new Tone.MembraneSynth().toDestination(),
            new Tone.MembraneSynth().toDestination(),
            new Tone.MembraneSynth().toDestination(),
          ]);
        }}
      >
        start
      </button>
      {/* <button
        onClick={() => {
          myTweenRef.current.play();
          Tone.Transport.start();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          myTweenRef.current.pause();
          Tone.Transport.pause();
        }}
      >
        Pause
      </button> */}
    </>
  );
}

export default Sequencer;

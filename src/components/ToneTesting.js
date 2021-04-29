import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
function ToneTesting() {
  let synth;
  let synth2;
  let synth3;
  Tone.Transport.bpm.value = 60;
  const playSound = () => {
    synth = new Tone.MembraneSynth().toDestination();
    synth2 = new Tone.MembraneSynth().toDestination();
    synth3 = new Tone.MembraneSynth().toDestination();
    synth.volume.value = -10;
    let loopBeat = new Tone.Loop(song, "4n");
    Tone.Transport.start();
    loopBeat.start(0);
  };
  const rampBPM = () => {
    Tone.Transport.bpm.rampTo(200, 1);
  };
  const song = (time) => {
    synth.triggerAttackRelease("C1", "8n", time, 1);
    synth2.triggerAttackRelease("A2", "8n", `+0.2`, 1);
    synth3.triggerAttackRelease("B2", "8n", `+0.5`, 1);
  };
  return (
    <div>
      <p>hello</p>
      <button onClick={playSound}>Start</button>
      <button
        onClick={() => {
          Tone.Transport.start();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          Tone.Transport.pause();
        }}
      >
        Pause
      </button>
      <button onClick={rampBPM}>Ramp BPM</button>
    </div>
  );
}

export default ToneTesting;

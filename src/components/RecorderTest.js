import React from "react";
import * as Tone from "tone";
function RecorderTest() {
  const actx = Tone.context;
  const dest = actx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);
  let index = 0;
  const func = (isRecording) => {
    // if (started) return;
    // started = true;
    const audio = document.querySelector("audio");
    const synth = new Tone.Synth();

    synth.connect(dest);
    synth.toDestination();

    const chunks = [];

    const notes = "CDEFGAB".split("").map((n) => `${n}4`);
    let note = 0;
    console.log(isRecording);
    if (isRecording) recorder.start();
    console.log(MediaRecorder.state);
    Tone.Transport.scheduleRepeat((time) => {
      //   if (note === 0)
      if (note > notes.length) {
        synth.triggerRelease(time);
        //   ! We are using manual recording-stop
        // if (isRecording) recorder.stop();
        Tone.Transport.stop();
      } else synth.triggerAttack(notes[note], time);
      //   note++;
      note = index % 8;
      index++;
    }, "4n");

    recorder.ondataavailable = (evt) => chunks.push(evt.data);
    recorder.onstop = (evt) => {
      console.log(chunks);
      let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      audio.src = URL.createObjectURL(blob);
    };

    Tone.Transport.start();
  };
  return (
    <div>
      <h1>Recorder</h1>
      <audio src="" controls></audio>
      <button onClick={() => func(false)}>Play</button>
      <button onClick={() => func(true)}>Play and record</button>
      <button
        onClick={() => {
          Tone.Transport.stop();
          recorder.stop();
        }}
      >
        Stop
      </button>
    </div>
  );
}

export default RecorderTest;

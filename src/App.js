import React from "react";
import "./_baseReset.scss";
import Metronome from "./components/Metronome";
import ToneTesting from "./components/ToneTesting";
import GsapToTesting from "./components/GsapToTesting";
import Sequencer from "./components/Sequencer";

// ! Import any component here to test
function App() {
  return (
    <div className="App">
      {/* <Metronome /> */}
      {/* <ToneTesting /> */}
      {/* <GsapToTesting /> */}
      <Sequencer />
    </div>
  );
}

export default App;

// App.js
import React from "react";
import Piano from "./components/Piano";
import ChordPlayer from "./components/ChordPlayer";
import "./styles.css";

const App = () => {
  return (
    <div className="app">
      <Piano />
      <ChordPlayer chord={["C4", "E4", "G4"]} />
    </div>
  );
};

export default App;

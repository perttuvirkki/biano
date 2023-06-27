// App.js
import React, { useState } from "react";
import Piano from "./components/Piano";
import ChordPlayer from "./components/ChordPlayer";
import { Chord, transpose } from "tonal";
import "./styles.css";

const App = () => {
  const [highlightedChord, setHighlightedChord] = useState([]);
  const [startingOctave, setStartingOctave] = useState(3);
  const [numberOfOctaves, setNumberOfOctaves] = useState(1);

  function flatToSharp(note) {
    return note
      .replace(/Db/g, "C#")
      .replace(/Eb/g, "D#")
      .replace(/Gb/g, "F#")
      .replace(/Ab/g, "G#")
      .replace(/Bb/g, "A#");
  }

  const handlePlayChord = (chordName, octave) => {
    const baseNote = chordName.charAt(0);
    const { intervals } = Chord.get(chordName);
    const chordNotes = intervals.map((interval) =>
      flatToSharp(transpose(`${baseNote}${octave}`, interval))
    );
    setHighlightedChord(chordNotes);
  };

  return (
    <div className="app">
      <Piano
        highlightedChord={highlightedChord}
        numberOfOctaves={numberOfOctaves}
        startingOctave={startingOctave}
      />
      <div className="chord-players-container">
        <ChordPlayer onPlayChord={handlePlayChord} octave="3" />
        <ChordPlayer onPlayChord={handlePlayChord} octave="3" />
        <ChordPlayer onPlayChord={handlePlayChord} octave="3" />
        <ChordPlayer onPlayChord={handlePlayChord} octave="3" />
      </div>

      <div>
        Starting Octave:
        {[1, 2, 3, 4, 5, 6].map((octave) => (
          <label key={octave}>
            <input
              type="radio"
              value={octave}
              checked={startingOctave === octave}
              onChange={() => setStartingOctave(octave)}
            />
            {octave}
          </label>
        ))}
      </div>
      <div>
        Number of Octaves:
        {[1, 2, 3, 4, 5, 6].map((octave) => (
          <label key={octave}>
            <input
              type="radio"
              value={octave}
              checked={numberOfOctaves === octave}
              onChange={() => setNumberOfOctaves(octave)}
            />
            {octave}
          </label>
        ))}
      </div>
    </div>
  );
};

export default App;

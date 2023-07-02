// App.js
import React, { useState } from "react";
import Piano from "./components/Piano";
import ChordPlayer from "./components/ChordPlayer";
import ChordLooper from "./components/ChordLooper";
import ProgressBar from "./components/ProgressBar";
import "./styles.css";

const App = () => {
  const [highlightedChord, setHighlightedChord] = useState([]);
  const [startingOctave, setStartingOctave] = useState(3);
  const [numberOfOctaves, setNumberOfOctaves] = useState(1);
  const [chordPlayerSettings, setChordPlayerSettings] = useState([
    { chordRoot: "C", chordType: "maj" },
    { chordRoot: "F", chordType: "maj" },
    { chordRoot: "A", chordType: "min" },
    { chordRoot: "G", chordType: "maj" },
  ]);
  const [currentBeat, setCurrentBeat] = useState(0);

  function flatToSharp(note) {
    return note
      .replace(/Db/g, "C#")
      .replace(/Eb/g, "D#")
      .replace(/Gb/g, "F#")
      .replace(/Ab/g, "G#")
      .replace(/Bb/g, "A#");
  }

  // const handlePlayChord = (chordName, octave) => {
  //   const baseNote = chordName.charAt(0);
  //   const { intervals } = Chord.get(chordName);
  //   const chordNotes = intervals.map((interval) =>
  //     flatToSharp(transpose(`${baseNote}${octave}`, interval))
  //   );
  //   setHighlightedChord(chordNotes);
  // };

  const handlePlayChord = (notes) => {
    const transformedNotes = notes.map(flatToSharp);
    setHighlightedChord(transformedNotes);
  };

  const handleChordChange = (index, newSettings) => {
    const newChordPlayerSettings = [...chordPlayerSettings];
    newChordPlayerSettings[index] = newSettings;
    setChordPlayerSettings(newChordPlayerSettings);
  };

  return (
    <div className="app">
      <ProgressBar
        currentBeat={currentBeat}
        totalBeats={chordPlayerSettings.length}
      />

      <Piano
        highlightedChord={highlightedChord}
        numberOfOctaves={numberOfOctaves}
        startingOctave={startingOctave}
      />
      <div className="chord-players-container">
        {chordPlayerSettings.map((settings, index) => (
          <ChordPlayer
            {...settings}
            octave="3"
            onPlayChord={handlePlayChord}
            onChordChange={(newSettings) =>
              handleChordChange(index, newSettings)
            }
            key={index}
          />
        ))}
      </div>
      <ChordLooper
        onPlayChord={handlePlayChord}
        octave="3"
        chords={chordPlayerSettings}
        setCurrentBeat={setCurrentBeat}
      />

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

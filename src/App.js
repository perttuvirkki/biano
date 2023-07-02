import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

import Piano from "./components/Piano";
import ChordPlayer from "./components/ChordPlayer";
import ChordLooper from "./components/ChordLooper";
import ProgressBar from "./components/ProgressBar";
import DrumMachine from "./components/DrumMachine";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const tempoRef = useRef(tempo); // Create a ref for the tempo state

  function flatToSharp(note) {
    return note
      .replace(/Db/g, "C#")
      .replace(/Eb/g, "D#")
      .replace(/Gb/g, "F#")
      .replace(/Ab/g, "G#")
      .replace(/Bb/g, "A#");
  }

  useEffect(() => {
    tempoRef.current = tempo; // Update the ref whenever tempo changes
  }, [tempo]);

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.bpm.value = tempoRef.current; // Use the ref instead of the state
      console.log(tempoRef);

      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying, tempoRef.current]); // Add tempoRef.current as a dependency

  const handlePlayChord = (notes) => {
    const transformedNotes = notes.map(flatToSharp);
    setHighlightedChord(transformedNotes);
  };

  const handleChordChange = (index, newSettings) => {
    const newChordPlayerSettings = [...chordPlayerSettings];
    newChordPlayerSettings[index] = newSettings;
    setChordPlayerSettings(newChordPlayerSettings);
  };

  const handleTempoChange = (event) => {
    setTempo(event.target.value);
  };

  return (
    <div className="app">
      <DrumMachine isPlaying={isPlaying} />

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
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        tempo={tempo}
      />
      <input
        type="range"
        min="60"
        max="180"
        value={tempo}
        onChange={handleTempoChange}
      />
      <span>{tempo} BPM</span>
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

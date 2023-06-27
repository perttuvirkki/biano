// ChordPlayer.js
import React, { useState } from "react";
import SoundEngine from "./SoundEngine";

const ChordPlayer = ({
  chordRoot,
  chordType,
  octave,
  onPlayChord,
  onChordChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Available chord roots and types
  const chordRoots = ["C", "D", "E", "F", "G", "A", "B"];
  const chordTypes = ["maj", "min", "dim", "7", "maj7", "min7"];

  const playChord = () => {
    const chordName = chordRoot + chordType;
    setIsPlaying(true);
    SoundEngine.playChord(chordName, octave);
    onPlayChord(chordName, octave);
    setTimeout(() => setIsPlaying(false), 1000); // Reset after 1 second
  };

  const handleClick = () => {
    playChord();
  };

  const handleChordRootChange = (event) => {
    onChordChange({ chordRoot: event.target.value, chordType });
  };

  const handleChordTypeChange = (event) => {
    onChordChange({ chordRoot, chordType: event.target.value });
  };

  return (
    <div className="chord-selector-container">
      <div className="dropdown-container">
        <select
          value={chordRoot}
          onChange={handleChordRootChange}
          className="dropdown"
        >
          {chordRoots.map((root) => (
            <option key={root} value={root}>
              {root}
            </option>
          ))}
        </select>
        <select
          value={chordType}
          onChange={handleChordTypeChange}
          className="dropdown"
        >
          {chordTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleClick}
        className={`chord-button ${isPlaying ? "playing" : ""}`}
      >
        {`${chordRoot}${chordType}`}
      </button>
    </div>
  );
};

export default ChordPlayer;

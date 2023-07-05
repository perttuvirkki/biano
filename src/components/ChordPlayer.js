import React, { useState } from "react";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";

const ChordPlayer = ({
  chordRoot,
  chordType,
  octave,
  onPlayChord,
  onChordChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const chordRoots = ["C", "D", "E", "F", "G", "A", "B"];
  const chordTypes = ["maj", "min", "dim", "7", "maj7", "min7", "6", "9"];

  const playChord = () => {
    const chordName = `${chordRoot}${chordType}`;
    setIsPlaying(true);

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );

    SoundEngine.playChord(notesInChord, octave);
    onPlayChord(notesInChord);
    setTimeout(() => setIsPlaying(false), 2000);
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
        {chordType === "maj" ? chordRoot : `${chordRoot}${chordType}`}
      </button>
    </div>
  );
};

export default ChordPlayer;

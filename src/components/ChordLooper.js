// ChordLooper.js
import React, { useState, useEffect } from "react";
import SoundEngine from "./SoundEngine";

const ChordLooper = ({ chords, onPlayChord, octave }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chordIndex, setChordIndex] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      playNextChord();
    }
  }, [isPlaying]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(playNextChord, 2000); // Play next chord every 2 seconds
    }
    return () => clearTimeout(timer);
  }, [chordIndex, isPlaying]);

  const playNextChord = () => {
    if (!isPlaying || !chords[chordIndex]) {
      return;
    }

    const { chordRoot, chordType } = chords[chordIndex];
    SoundEngine.playChord(`${chordRoot}${chordType}`, octave);
    onPlayChord(`${chordRoot}${chordType}`, octave);

    const nextChordIndex = (chordIndex + 1) % chords.length;
    setChordIndex(nextChordIndex);
  };

  const handleClick = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    if (!isPlaying) {
      setChordIndex(0);
    }
  };

  return (
    <button onClick={handleClick}>
      {isPlaying ? "Stop Loop" : "Start Loop"}
    </button>
  );
};

export default ChordLooper;

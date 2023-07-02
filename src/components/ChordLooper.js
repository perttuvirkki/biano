import React, { useState, useEffect, useRef } from "react";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";
import * as Tone from "tone";

const ChordLooper = ({
  chords,
  onPlayChord,
  octave,
  setCurrentBeat,
  isPlaying,
  setIsPlaying,
}) => {
  const chordIndexRef = useRef(0); // Use a ref instead of state
  const chordsRef = useRef(chords); // Create a ref for the chords state

  useEffect(() => {
    chordsRef.current = chords; // Update the ref whenever chords changes
  }, [chords]);

  const playNextChord = () => {
    if (!chordsRef.current[chordIndexRef.current]) {
      return;
    }
    setCurrentBeat(chordIndexRef.current);

    const { chordRoot, chordType } = chordsRef.current[chordIndexRef.current]; // Use the ref instead of the state
    const chordName = `${chordRoot}${chordType}`;

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    SoundEngine.playChord(notesInChord, octave);

    onPlayChord(notesInChord);
    chordIndexRef.current =
      (chordIndexRef.current + 1) % chordsRef.current.length; // Use the ref instead of the state
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.scheduleRepeat(playNextChord, "1m");
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying]);

  const handleClick = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <div>
      <button onClick={handleClick}>
        {isPlaying ? "Stop Loop" : "Start Loop"}
      </button>
    </div>
  );
};

export default ChordLooper;

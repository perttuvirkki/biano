import React, { useState, useEffect, useRef } from "react";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";
import * as Tone from "tone";

const ChordLooper = ({ chords, onPlayChord, octave, setCurrentBeat }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const chordIndexRef = useRef(0); // Use a ref instead of state

  const playNextChord = () => {
    if (!chords[chordIndexRef.current]) {
      return;
    }
    setCurrentBeat(chordIndexRef.current);

    const { chordRoot, chordType } = chords[chordIndexRef.current];
    const chordName = `${chordRoot}${chordType}`;

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    SoundEngine.playChord(notesInChord, octave);

    onPlayChord(notesInChord);
    chordIndexRef.current = (chordIndexRef.current + 1) % chords.length; // Update the ref
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying]);

  const handleClick = () => {
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.scheduleRepeat(playNextChord, "1m");

    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleTempoChange = (event) => {
    setTempo(event.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>
        {isPlaying ? "Stop Loop" : "Start Loop"}
      </button>
      <input
        type="range"
        min="60"
        max="180"
        value={tempo}
        onChange={handleTempoChange}
      />
      <span>{tempo} BPM</span>
    </div>
  );
};

export default ChordLooper;

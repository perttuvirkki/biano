import React, { useState, useEffect, useCallback } from "react";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";
import * as Tone from "tone";

const ChordLooper = ({ chords, onPlayChord, octave }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chordIndex, setChordIndex] = useState(0);
  const [tempo, setTempo] = useState(120);

  const playNextChord = () => {
    if (!chords[chordIndex]) {
      return;
    }

    const { chordRoot, chordType } = chords[chordIndex];
    const chordName = `${chordRoot}${chordType}`;

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    SoundEngine.playChord(notesInChord, octave);
    //SoundEngine.playArpeggio(notesInChord, tempo);

    onPlayChord(notesInChord);
    const nextChordIndex = (chordIndex + 1) % chords.length;
    setChordIndex(nextChordIndex);
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
    Tone.Transport.scheduleRepeat(playNextChord, "1m"); // '4n' stands for quarter note, which would be one beat at the given tempo.

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

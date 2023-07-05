import React, { useEffect, useRef } from "react";
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
  tempo,
}) => {
  const chordIndexRef = useRef(0);
  const chordsRef = useRef(chords);

  useEffect(() => {
    chordsRef.current = chords;
  }, [chords]);

  const playNextChord = () => {
    if (!chordsRef.current[chordIndexRef.current]) {
      return;
    }
    setCurrentBeat(chordIndexRef.current);

    const { chordRoot, chordType } = chordsRef.current[chordIndexRef.current];
    const chordName = `${chordRoot}${chordType}`;

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    //SoundEngine.playChord(notesInChord);
    SoundEngine.playArpeggio(notesInChord, tempo);
    console.log(notesInChord);

    onPlayChord(notesInChord);
    chordIndexRef.current =
      (chordIndexRef.current + 1) % chordsRef.current.length;
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

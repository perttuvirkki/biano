import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";
import * as Tone from "tone";
import { setCurrentBeat } from "../redux/slices/currentBeatSlice";
import { setDrumCurrentBeat } from "../redux/slices/drumCurrentBeatSlice";
import { setIsPlaying } from "../redux/slices/isPlayingSlice";

const ChordLooper = () => {
  const dispatch = useDispatch();
  const chords = useSelector((state) => state.chordPlayerSettings);
  const isPlaying = useSelector((state) => state.isPlaying);
  const tempo = useSelector((state) => state.tempo);
  const [playMethod, setPlayMethod] = useState("playChord");

  const chordIndexRef = useRef(0);
  const chordsRef = useRef(chords);
  const tempoRef = useRef(tempo);
  const octave = 4;

  useEffect(() => {
    chordsRef.current = chords;
    tempoRef.current = tempo;
  }, [chords, tempo]);

  const playNextChord = () => {
    if (!chordsRef.current[chordIndexRef.current]) {
      return;
    }
    dispatch(setCurrentBeat(chordIndexRef.current));

    const { chordRoot, chordType } = chordsRef.current[chordIndexRef.current];
    const chordName = `${chordRoot}${chordType}`;

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    const bassNote = `${chordRoot}${octave - 1}`;
    notesInChord.unshift(bassNote);

    switch (playMethod) {
      case "playChord":
        SoundEngine.playChord(notesInChord, dispatch);
        break;
      case "playArpeggio":
        SoundEngine.playArpeggio(notesInChord, tempoRef.current, dispatch);
        break;
      case "playInvertedChord":
        SoundEngine.playInvertedChord(notesInChord, dispatch);
        break;
      default:
        break;
    }

    chordIndexRef.current =
      (chordIndexRef.current + 1) % chordsRef.current.length;
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.scheduleRepeat(playNextChord, "1n");
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying]);

  const handleClick = () => {
    if (isPlaying) {
      dispatch(setCurrentBeat(0));
      dispatch(setDrumCurrentBeat(0));
      chordIndexRef.current = 0;
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  return (
    <div>
      <button onClick={handleClick}>
        {isPlaying ? "Stop Loop" : "Start Loop"}
      </button>
      <select
        value={playMethod}
        onChange={(e) => setPlayMethod(e.target.value)}
      >
        <option value="playChord">Play Chord</option>
        <option value="playArpeggio">Play Arpeggio</option>
        <option value="playInvertedChord">Play Inverted Chord</option>
      </select>
    </div>
  );
};

export default ChordLooper;

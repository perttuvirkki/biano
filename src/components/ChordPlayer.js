import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transpose, Chord } from "tonal";
import SoundEngine from "./SoundEngine";
import { setChordPlayerSettings } from "../redux/slices/chordPlayerSettingsSlice";

const ChordPlayer = ({ octave, index }) => {
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);

  const chordRoots = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const chordTypes = ["maj", "min", "dim", "7", "maj7", "min7", "6", "9"];

  const chordRoot = useSelector(
    (state) => state.chordPlayerSettings[index].chordRoot
  );
  const chordType = useSelector(
    (state) => state.chordPlayerSettings[index].chordType
  );

  function sharpToFlat(note) {
    return note
      .replace(/C##/g, "D")
      .replace(/D##/g, "E")
      .replace(/E##/g, "F#")
      .replace(/F##/g, "G")
      .replace(/G##/g, "A")
      .replace(/A##/g, "B")
      .replace(/B##/g, "C#")
      .replace(/C#/g, "Db")
      .replace(/D#/g, "Eb")
      .replace(/E#/g, "F")
      .replace(/F#/g, "Gb")
      .replace(/G#/g, "Ab")
      .replace(/A#/g, "Bb")
      .replace(/B#/g, "C");
  }

  const playChord = () => {
    const chordName = `${chordRoot}${chordType}`;
    setIsPlaying(true);

    const { intervals } = Chord.get(chordName);
    const notesInChord = intervals.map((interval) =>
      transpose(`${chordRoot}${octave}`, interval)
    );
    const bassNote = `${chordRoot}${octave - 1}`;
    notesInChord.unshift(bassNote);

    console.log("chord: " + notesInChord);
    // Convert sharp notes to flat notes
    const flatNotesInChord = notesInChord.map(sharpToFlat);
    console.log("flatnotes: " + flatNotesInChord);

    SoundEngine.playInvertedChord(flatNotesInChord, dispatch);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleClick = () => {
    playChord();
  };

  const handleChordRootChange = (event) => {
    dispatch(
      setChordPlayerSettings({
        index,
        settings: { chordRoot: event.target.value, chordType },
      })
    );
  };

  const handleChordTypeChange = (event) => {
    dispatch(
      setChordPlayerSettings({
        index,
        settings: { chordRoot, chordType: event.target.value },
      })
    );
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

// ChordPlayer.js
import React from "react";
import NotePlayer from "./NotePlayer";

const ChordPlayer = ({ chord }) => {
  const players = chord.map((note) => NotePlayer({ note }));

  const playChord = () => {
    players.forEach((play) => play());
  };

  return (
    <button className="chord-button" onClick={playChord}>
      Play chord: {chord.join("-")}
    </button>
  );
};

export default ChordPlayer;

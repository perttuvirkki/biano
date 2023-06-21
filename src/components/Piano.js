// Piano.js
import React from "react";
import PianoKey from "./PianoKey";

const notes = [
  "C4",
  "Db4",
  "D4",
  "Eb4",
  "E4",
  "F4",
  "Gb4",
  "G4",
  "Ab4",
  "A4",
  "Bb4",
  "B4",
];

const Piano = () => {
  let whiteKeyIndex = 0;

  return (
    <div className="piano">
      {notes.map((note, index) => {
        const isBlack = note.includes("b");
        if (!isBlack) {
          whiteKeyIndex++;
        }
        return (
          <PianoKey
            note={note}
            isBlack={isBlack}
            keyIndex={isBlack ? whiteKeyIndex - 1 : whiteKeyIndex}
          />
        );
      })}
    </div>
  );
};

export default Piano;

// Piano.js
import React from "react";
import PianoKey from "./PianoKey";

const Piano = ({ highlightedChord, numberOfOctaves, startingOctave }) => {
  const octaves = [...Array(numberOfOctaves).keys()]
    .map((n) => n + startingOctave)
    .filter((octave) => octave >= 1 && octave <= 6);
  const notes = [
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

  const getFullNote = (note, octave) => `${note}${octave}`;

  let whiteKeyIndex = 0;

  return (
    <div className="piano">
      {octaves.map((octave) =>
        notes.map((note, index) => {
          const isBlack = note.includes("#");
          if (!isBlack) {
            whiteKeyIndex++;
          }
          return (
            <PianoKey
              key={note + index}
              noteImport={getFullNote(note, octave)}
              isBlack={isBlack}
              keyIndex={isBlack ? whiteKeyIndex - 1 : whiteKeyIndex}
              isHighlighted={highlightedChord.includes(
                getFullNote(note, octave)
              )}
            />
          );
        })
      )}
    </div>
  );
};

export default Piano;

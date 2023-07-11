import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PianoKey from "./PianoKey";
import { Note } from "tonal";

const Piano = () => {
  const highlightedChord = useSelector((state) => state.highlightedChord);

  const octaves = [...Array(7).keys()].map((n) => n + 1);
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

  function flatToSharp(note) {
    return note
      .replace(/Db/g, "C#")
      .replace(/Eb/g, "D#")
      .replace(/Gb/g, "F#")
      .replace(/Ab/g, "G#")
      .replace(/Bb/g, "A#");
  }

  const refs = {};

  octaves.forEach((octave) => {
    notes.forEach((note) => {
      refs[`${note}${octave}`] = React.createRef();
    });
  });

  const getFullNote = (note, octave) => `${note}${octave}`;

  let whiteKeyIndex = 0;

  useEffect(() => {
    if (highlightedChord.length > 0) {
      const frequencies = highlightedChord.map(Note.freq);

      const meanFrequency =
        frequencies.reduce((a, b) => a + b, 0) / frequencies.length;

      const meanNote = Note.fromFreq(meanFrequency);

      flatToSharp(meanNote);
      refs[flatToSharp(meanNote)]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [highlightedChord]);

  useEffect(() => {
    const middleFRef = refs["F4"];
    middleFRef?.current?.scrollIntoView({
      block: "center",
      inline: "center",
    });
  }, []);

  return (
    <div className="piano-container">
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
                ref={refs[getFullNote(note, octave)]}
                noteImport={getFullNote(note, octave)}
                isBlack={isBlack}
                keyIndex={isBlack ? whiteKeyIndex - 1 : whiteKeyIndex}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Piano;

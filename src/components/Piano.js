import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PianoKey from "./PianoKey";
import { Note } from "tonal";

const Piano = () => {
  const highlightedChord = useSelector((state) => state.highlightedChord);

  const octaves = [...Array(7).keys()].map((n) => n + 1);
  const notes = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ];

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

      refs[meanNote]?.current?.scrollIntoView({
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
            const isBlack = note.includes("b");
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

import React, { useState } from "react";
import SoundEngine from "./SoundEngine";

const PianoKey = ({ noteImport, isBlack, keyIndex, isHighlighted }) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = () => {
    setIsActive(true);
    SoundEngine.playNote(noteImport);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`piano-key ${isBlack ? "black" : "white"} ${
        isHighlighted ? "highlighted" : ""
      } ${isActive ? "active" : ""}`}
      style={{
        left: `${isBlack ? keyIndex * 60 + 60 : keyIndex * 60}px`,
      }}
    >
      {noteImport}
    </button>
  );
};

export default PianoKey;

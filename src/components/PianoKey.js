import React, { useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import SoundEngine from "./SoundEngine";

const PianoKey = forwardRef(({ noteImport, isBlack, keyIndex }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const highlightedChord = useSelector((state) => state.highlightedChord);
  const isHighlighted = highlightedChord.includes(noteImport);
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
      ref={ref}
    >
      <span style={{ position: "relative", bottom: "-40%" }}>
        {noteImport.startsWith("C") && !noteImport.includes("b")
          ? noteImport
          : ""}
      </span>
    </button>
  );
});

export default PianoKey;

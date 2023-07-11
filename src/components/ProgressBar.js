import React from "react";
import { useSelector } from "react-redux";

const ProgressBar = () => {
  const currentBeat = useSelector((state) => state.currentBeat);
  const totalBeats = useSelector((state) => state.chordPlayerSettings.length);

  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: totalBeats }, (_, i) => (
        <div
          key={i}
          style={{
            width: "20px",
            height: "20px",
            margin: "5px",
            backgroundColor: i === currentBeat ? "blue" : "gray",
          }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;

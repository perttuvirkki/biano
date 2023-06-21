// PianoKey.js
import React from "react";
import useSound from "use-sound";

const PianoKey = ({ note, isBlack, keyIndex }) => {
  const file = require(`../piano-mp3/${note}.mp3`);
  const [play] = useSound(file, { volume: 1 });

  return (
    <button
      onMouseDown={play}
      className={`piano-key ${isBlack ? "black" : "white"}`}
      style={{
        left: `${isBlack ? keyIndex * 60 + 60 : keyIndex * 60}px`,
      }}
    >
      {note}
    </button>
  );
};

export default PianoKey;

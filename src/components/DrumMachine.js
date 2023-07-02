import React, { useState, useEffect, useRef } from "react";
import SoundEngine from "./SoundEngine";
import * as Tone from "tone";

const DrumMachine = ({ isPlaying }) => {
  const [beatMatrix, setBeatMatrix] = useState({
    bassDrum: Array(8).fill(false),
    snare: Array(8).fill(false),
    hiHat: Array(8).fill(false),
  });

  const beatMatrixRef = useRef(beatMatrix); // Create a ref for the beatMatrix state

  useEffect(() => {
    beatMatrixRef.current = beatMatrix; // Update the ref whenever beatMatrix changes
  }, [beatMatrix]);

  const beatIndexRef = useRef(0); // Use a ref instead of state

  const playNextBeat = () => {
    for (const soundName in beatMatrixRef.current) {
      // Use the ref instead of the state
      if (beatMatrixRef.current[soundName][beatIndexRef.current]) {
        SoundEngine.playDrumSound(soundName);
      }
    }

    beatIndexRef.current = (beatIndexRef.current + 1) % 8; // Update the ref
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.scheduleRepeat(playNextBeat, "4n");
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying]);

  const toggleBeat = (soundName, beat) => {
    setBeatMatrix((prevMatrix) => ({
      ...prevMatrix,
      [soundName]: prevMatrix[soundName].map((isOn, i) =>
        i === beat ? !isOn : isOn
      ),
    }));
  };

  return (
    <div>
      {["hiHat", "snare", "bassDrum"].map((soundName) => (
        <div key={soundName}>
          {soundName}
          <br />

          {beatMatrix[soundName].map((isOn, beat) => (
            <button
              key={beat}
              className={`drum-button ${isOn ? "playing" : ""}`}
              onClick={() => toggleBeat(soundName, beat)}
            >
              {isOn ? "On" : "Off"}
              {beat}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DrumMachine;

import React, { useState, useEffect, useRef } from "react";
import SoundEngine from "./SoundEngine";
import DrumProgressBar from "./DrumPorgressBar";
import * as Tone from "tone";

const DrumMachine = ({ isPlaying }) => {
  const [beatMatrix, setBeatMatrix] = useState({
    bassDrum: Array(8).fill(false),
    snare: Array(8).fill(false),
    hiHat: Array(8).fill(false),
  });
  const [currentBeat, setCurrentBeat] = useState(0);

  const beatMatrixRef = useRef(beatMatrix);

  useEffect(() => {
    beatMatrixRef.current = beatMatrix;
  }, [beatMatrix]);

  const beatIndexRef = useRef(0);

  const playNextBeat = () => {
    for (const soundName in beatMatrixRef.current) {
      if (beatMatrixRef.current[soundName][beatIndexRef.current]) {
        SoundEngine.playDrumSound(soundName);
      }
    }
    setCurrentBeat(beatIndexRef.current);
    beatIndexRef.current = (beatIndexRef.current + 1) % 8;
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
      <DrumProgressBar currentBeat={currentBeat} />
    </div>
  );
};

export default DrumMachine;

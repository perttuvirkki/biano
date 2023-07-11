import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SoundEngine from "./SoundEngine";
import DrumProgressBar from "./DrumProgressBar";
import * as Tone from "tone";
import { setDrumCurrentBeat } from "../redux/slices/drumCurrentBeatSlice";

const DrumMachine = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.isPlaying);
  const [beatCount, setBeatCount] = useState(8);
  const [beatMatrix, setBeatMatrix] = useState({
    bassDrum: Array(beatCount).fill(false),
    snare: Array(beatCount).fill(false),
    hiHat: Array(beatCount).fill(false),
  });

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
    dispatch(setDrumCurrentBeat(beatIndexRef.current));
    beatIndexRef.current = (beatIndexRef.current + 1) % beatCount;
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.scheduleRepeat(
        playNextBeat,
        beatCount === 8 ? "4n" : "8n"
      );
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying, beatCount]);

  const toggleBeat = (soundName, beat) => {
    setBeatMatrix((prevMatrix) => ({
      ...prevMatrix,
      [soundName]: prevMatrix[soundName].map((isOn, i) =>
        i === beat ? !isOn : isOn
      ),
    }));

    if (!beatMatrix[soundName][beat]) {
      SoundEngine.playDrumSound(soundName);
    }
  };

  const switchBeatCount = () => {
    const newBeatCount = beatCount === 8 ? 16 : 8;
    setBeatCount(newBeatCount);
    setBeatMatrix({
      bassDrum: Array(newBeatCount).fill(false),
      snare: Array(newBeatCount).fill(false),
      hiHat: Array(newBeatCount).fill(false),
    });
  };

  return (
    <div>
      <button onClick={switchBeatCount}>
        Switch to {beatCount === 8 ? "16" : "8"} beats
      </button>
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
      <DrumProgressBar />
    </div>
  );
};

export default DrumMachine;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SoundEngine from "./SoundEngine";
import DrumProgressBar from "./DrumProgressBar";
import * as Tone from "tone";
import { setDrumCurrentBeat } from "../redux/slices/drumCurrentBeatSlice";

const DrumMachine = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.isPlaying);
  const [beatCount, setBeatCount] = useState(16);
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
      Tone.Transport.scheduleRepeat(playNextBeat, "8n");
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      beatIndexRef.current = 0; // Reset the beat index to 0
      dispatch(setDrumCurrentBeat(0)); // Reset the drum current beat to 0
    }
  }, [isPlaying, beatCount]);

  const toggleBeat = (soundName, beat) => {
    SoundEngine.playDrumSound(soundName);

    setBeatMatrix((prevMatrix) => {
      const currentBeatState = prevMatrix[soundName][beat];
      const nextBeatState = prevMatrix[soundName][beat + 1];

      return {
        ...prevMatrix,
        [soundName]: prevMatrix[soundName].map((isOn, i) => {
          if (i === beat) {
            return !isOn;
          } else if (i === beat + 1) {
            if (currentBeatState && !nextBeatState) {
              return true;
            } else if (currentBeatState && nextBeatState) {
              return false;
            } else {
              return isOn;
            }
          } else {
            return isOn;
          }
        }),
      };
    });
  };

  return (
    <div>
      {["hiHat", "snare", "bassDrum"].map((soundName) => (
        <div key={soundName}>
          {soundName}
          <br />

          {beatMatrix[soundName].map(
            (isOn, beat) =>
              beat % 2 === 0 && (
                <button
                  key={beat}
                  className={`drum-button ${isOn ? "playing" : ""}`}
                  onClick={() => toggleBeat(soundName, beat)}
                  style={{
                    background: beatMatrix[soundName][beat]
                      ? beatMatrix[soundName][beat + 1]
                        ? "#007bff"
                        : "linear-gradient(to right, #007bff 50%, white 50%)"
                      : beatMatrix[soundName][beat + 1]
                      ? "linear-gradient(to right, white 50%, #007bff 50%)"
                      : "white",
                  }}
                ></button>
              )
          )}
        </div>
      ))}
      <DrumProgressBar />
    </div>
  );
};

export default DrumMachine;

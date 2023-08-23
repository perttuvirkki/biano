import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useDispatch, useSelector } from "react-redux";
import { clearHighlightedChord } from "./redux/slices/highlightedChordSlice";
import { setChordPlayerSettings } from "./redux/slices/chordPlayerSettingsSlice";
import { setCurrentBeat } from "./redux/slices/currentBeatSlice";
import { setIsPlaying } from "./redux/slices/isPlayingSlice";
import { setTempo } from "./redux/slices/tempoSlice";
import { ReactComponent as PianoSVG } from "./piano_svg.svg"; // Import as a React component

import Piano from "./components/Piano";
import ChordPlayer from "./components/ChordPlayer";
import ChordLooper from "./components/ChordLooper";
import ProgressBar from "./components/ProgressBar";
import DrumMachine from "./components/DrumMachine";
import "./styles.css";

const App = () => {
  const dispatch = useDispatch();
  const highlightedChord = useSelector((state) => state.highlightedChord);
  const chordPlayerSettings = useSelector((state) => state.chordPlayerSettings);
  const currentBeat = useSelector((state) => state.currentBeat);
  const isPlaying = useSelector((state) => state.isPlaying);
  const tempo = useSelector((state) => state.tempo);
  const tempoRef = useRef(tempo);

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const startAudioAndLoadAssets = () => {
    Tone.start()
      .then(() => {
        setAudioStarted(true);
        return Tone.loaded();
      })
      .then(() => {
        setAssetsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading assets:", error);
      });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        dispatch(setIsPlaying(!isPlaying));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, dispatch]);

  useEffect(() => {
    tempoRef.current = tempo;
  }, [tempo]);

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.bpm.value = tempoRef.current;

      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [isPlaying, tempoRef.current]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch(clearHighlightedChord());
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [highlightedChord, dispatch]);

  const handleChordChange = (index, newSettings) => {
    const newChordPlayerSettings = [...chordPlayerSettings];
    newChordPlayerSettings[index] = newSettings;
    dispatch(setChordPlayerSettings(newChordPlayerSettings));
  };

  const handleTempoChange = (event) => {
    dispatch(setTempo(event.target.value));
  };

  if (!audioStarted) {
    return (
      <div className="loading-screen">
        <PianoSVG className="piano-svg" />{" "}
        <button className="enter-button" onClick={startAudioAndLoadAssets}>
          Lets Play!
        </button>
      </div>
    );
  }

  if (audioStarted && !assetsLoaded) {
    return (
      <div className="loading-screen">
        <p>Loading assets...</p>
      </div>
    );
  }
  return (
    <div className="app">
      <DrumMachine isPlaying={isPlaying} />

      <Piano highlightedChord={highlightedChord} />
      <div className="chord-players-container">
        {chordPlayerSettings.map((settings, index) => (
          <ChordPlayer
            {...settings}
            octave="4"
            onChordChange={(newSettings) =>
              handleChordChange(index, newSettings)
            }
            key={index}
            index={index}
          />
        ))}
      </div>
      <ProgressBar
        currentBeat={currentBeat}
        totalBeats={chordPlayerSettings.length}
      />
      <ChordLooper
        octave="3"
        chords={chordPlayerSettings}
        setCurrentBeat={(beat) => dispatch(setCurrentBeat(beat))}
        isPlaying={isPlaying}
        setIsPlaying={(playing) => dispatch(setIsPlaying(playing))}
        tempo={tempoRef.current}
      />
      <input
        type="range"
        min="60"
        max="180"
        value={tempo}
        onChange={handleTempoChange}
      />
      <span>{tempo} BPM</span>
    </div>
  );
};

export default App;

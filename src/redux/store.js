import { configureStore } from "@reduxjs/toolkit";
import highlightedChordReducer from "./slices/highlightedChordSlice";
import chordPlayerSettingsReducer from "./slices/chordPlayerSettingsSlice";
import currentBeatReducer from "./slices/currentBeatSlice";
import drumCurrentBeatReducer from "./slices/drumCurrentBeatSlice";
import isPlayingReducer from "./slices/isPlayingSlice";
import tempoReducer from "./slices/tempoSlice";

const store = configureStore({
  reducer: {
    highlightedChord: highlightedChordReducer,
    chordPlayerSettings: chordPlayerSettingsReducer,
    currentBeat: currentBeatReducer,
    drumCurrentBeat: drumCurrentBeatReducer,
    isPlaying: isPlayingReducer,
    tempo: tempoReducer,
  },
});

export default store;

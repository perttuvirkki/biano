// highlightedChordSlice.js
import { createSlice } from "@reduxjs/toolkit";

const highlightedChordSlice = createSlice({
  name: "highlightedChord",
  initialState: [],
  reducers: {
    setHighlightedChord: (state, action) => {
      return action.payload;
    },
    clearHighlightedChord: () => {
      return [];
    },
  },
});

export const { setHighlightedChord, clearHighlightedChord } =
  highlightedChordSlice.actions;

export default highlightedChordSlice.reducer;

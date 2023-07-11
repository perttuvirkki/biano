// isPlayingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const isPlayingSlice = createSlice({
  name: "isPlaying",
  initialState: false,
  reducers: {
    setIsPlaying: (state, action) => action.payload,
  },
});

export const { setIsPlaying } = isPlayingSlice.actions;

export default isPlayingSlice.reducer;

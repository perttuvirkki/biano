// currentBeatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const currentBeatSlice = createSlice({
  name: "currentBeat",
  initialState: 0,
  reducers: {
    setCurrentBeat: (state, action) => action.payload,
  },
});

export const { setCurrentBeat } = currentBeatSlice.actions;

export default currentBeatSlice.reducer;

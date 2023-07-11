import { createSlice } from "@reduxjs/toolkit";

export const drumCurrentBeatSlice = createSlice({
  name: "drumCurrentBeat",
  initialState: 0,
  reducers: {
    setDrumCurrentBeat: (state, action) => action.payload,
  },
});

export const { setDrumCurrentBeat } = drumCurrentBeatSlice.actions;

export default drumCurrentBeatSlice.reducer;

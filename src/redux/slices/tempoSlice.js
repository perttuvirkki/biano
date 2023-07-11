// tempoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tempoSlice = createSlice({
  name: "tempo",
  initialState: 120,
  reducers: {
    setTempo: (state, action) => action.payload,
  },
});

export const { setTempo } = tempoSlice.actions;

export default tempoSlice.reducer;

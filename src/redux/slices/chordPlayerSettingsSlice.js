import { createSlice } from "@reduxjs/toolkit";

export const chordPlayerSettingsSlice = createSlice({
  name: "chordPlayerSettings",
  initialState: [
    { chordRoot: "C", chordType: "maj" },
    { chordRoot: "F", chordType: "maj" },
    { chordRoot: "A", chordType: "min" },
    { chordRoot: "G", chordType: "maj" },
  ],
  reducers: {
    setChordPlayerSettings: (state, action) => {
      const { index, settings } = action.payload;
      state[index] = settings;
    },
  },
});

export const { setChordPlayerSettings } = chordPlayerSettingsSlice.actions;

export default chordPlayerSettingsSlice.reducer;

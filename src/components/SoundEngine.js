import { Howl } from "howler";
import { Note, transpose, Chord } from "tonal";

// Sound setup...
const lengthOfNote = 2500; // adjust to the length of each note in milliseconds
let timeIndex = 0;
let sprite = {};

for (let i = 24; i <= 108; i++) {
  sprite[`Note${i}`] = [timeIndex, lengthOfNote];
  timeIndex += lengthOfNote;
}

const sound = new Howl({
  src: ["./assets/steinway-grand-piano.mp3"],
  sprite: sprite,
});

const SoundEngine = {
  playNote: (note) => {
    let spriteName = `Note${Note.midi(note)}`;
    sound.play(spriteName);
  },
  playChord: (chordSymbol, octave) => {
    const baseNote = chordSymbol.charAt(0);
    const { intervals } = Chord.get(chordSymbol);
    const chordNotes = intervals.map((interval) =>
      transpose(`${baseNote}${octave}`, interval)
    );
    console.log(chordNotes);

    chordNotes.forEach((note) => {
      SoundEngine.playNote(note);
    });
  },
};

export default SoundEngine;

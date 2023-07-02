import { Howl } from "howler";
import { Note } from "tonal";

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

const drumSounds = new Howl({
  src: ["./assets/drums-socal.mp3"],
  sprite: {
    bassDrum: [0, 2000],
    snare: [2500, 2000],
    hiHat: [5000, 2000],
  },
});

const SoundEngine = {
  playNote: (note) => {
    let spriteName = `Note${Note.midi(note)}`;
    sound.play(spriteName);
  },
  playChord: (notesInChord) => {
    notesInChord.forEach((note) => {
      SoundEngine.playNote(note);
    });
  },
  playArpeggio: (notesInChord, tempo) => {
    const delay = 60000 / (notesInChord.length + 1) / tempo; // Add 1 to the length for the extra note
    notesInChord.forEach((note, index) => {
      setTimeout(() => {
        SoundEngine.playNote(note);
      }, index * delay);
    });

    // Play the middle note again after the last note
    const middleNoteIndex = Math.floor(notesInChord.length / 2);
    setTimeout(() => {
      SoundEngine.playNote(notesInChord[middleNoteIndex]);
    }, notesInChord.length * delay);
  },

  playDrumSound: (soundName) => {
    drumSounds.play(soundName);
  },
};

export default SoundEngine;

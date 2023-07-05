import { Howl } from "howler";
import { Note } from "tonal";

const lengthOfNote = 2500;
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
    const beatDurationInMilliseconds = (60000 / tempo) * 2; // Duration of a beat in milliseconds
    let delay = 0;
    if (notesInChord.length === 4) {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1.5); // Delay between each note
    } else {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1); // Delay between each note
    }

    console.log(delay);
    notesInChord.forEach((note, index) => {
      setTimeout(() => {
        SoundEngine.playNote(note);
      }, index * delay);
    });

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

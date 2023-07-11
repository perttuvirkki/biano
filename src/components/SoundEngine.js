import { Howl } from "howler";
import { Note } from "tonal";
import { setHighlightedChord } from "../redux/slices/highlightedChordSlice";
import { Sampler, start } from "tone";
import * as Tone from "tone";

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

const drumSounds = {
  bassDrum: new Sampler({
    urls: {
      C4: "./assets/bassdrum.mp3",
    },
  }),
  snare: new Sampler({
    urls: {
      C4: "./assets/snare.mp3",
    },
  }),
  hiHat: new Sampler({
    urls: {
      C4: "./assets/hihat.mp3",
    },
  }),
};

const SoundEngine = {
  playNote: (note) => {
    let spriteName = `Note${Note.midi(note)}`;
    sound.play(spriteName);
  },
  playChord: (notesInChord, dispatch) => {
    dispatch(setHighlightedChord(notesInChord));
    notesInChord.forEach((note) => {
      SoundEngine.playNote(note);
    });
  },
  playArpeggio: (notesInChord, tempo, dispatch) => {
    const beatDurationInMilliseconds = (60000 / tempo) * 2; // Duration of a beat in milliseconds
    let delay = 0;
    if (notesInChord.length === 4) {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1); // Delay between each note
    } else {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1); // Delay between each note
    }

    notesInChord.forEach((note, index) => {
      setTimeout(() => {
        SoundEngine.playNote(note);
      }, index * delay);
    });
    dispatch(setHighlightedChord(notesInChord));

    setTimeout(() => {
      SoundEngine.playNote(notesInChord[notesInChord.length - 2]);
    }, notesInChord.length * delay);
    setTimeout(() => {
      SoundEngine.playNote(notesInChord[notesInChord.length - 3]);
    }, (notesInChord.length + 1) * delay);
  },

  playInvertedChord: (notesInChord, dispatch) => {
    const invertedChord = [...notesInChord];

    const random = Math.random();
    let noteToModify;

    if (random < 0.33) {
      // 1/3 chance to not mutate the chord
      noteToModify = null;
    } else if (random < 0.66) {
      // 1/3 chance to transpose the second note up by one octave
      noteToModify = 1;
    } else {
      // 1/3 chance to transpose the last note down by one octave
      noteToModify = 3;
    }

    if (noteToModify !== null) {
      const note = invertedChord[noteToModify].slice(0, -1);
      let octave = parseInt(invertedChord[noteToModify].slice(-1));

      if (noteToModify === 1) {
        octave += 1;
      } else if (noteToModify === 3) {
        octave -= 1;
      }

      invertedChord[noteToModify] = `${note}${octave}`;
    }

    dispatch(setHighlightedChord(invertedChord));

    invertedChord.forEach((note) => {
      SoundEngine.playNote(note);
    });
  },

  playDrumSound: (soundName) => {
    drumSounds[soundName].triggerAttackRelease("C4", "4n").toDestination();
  },
};

export default SoundEngine;

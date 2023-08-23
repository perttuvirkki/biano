import { setHighlightedChord } from "../redux/slices/highlightedChordSlice";
import { Sampler } from "tone";

const notes = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];

let pianoSounds = {};
let drumSounds = {};

for (let octave = 1; octave <= 7; octave++) {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    let noteWithOctave = `${note}${octave}`;

    pianoSounds[noteWithOctave] = new Sampler({
      urls: {
        C4: `./assets/notes/${noteWithOctave}.mp3`,
      },
    });
  }
}

drumSounds = {
  bassDrum: new Sampler({
    urls: {
      C4: "./assets/bassdrum.mp3",
    },
    volume: -2,
  }),
  snare: new Sampler({
    urls: {
      C4: "./assets/snare.mp3",
    },
    volume: -2,
  }),
  hiHat: new Sampler({
    urls: {
      C4: "./assets/hihat.mp3",
    },
    volume: -2,
  }),
};

const SoundEngine = {
  playNote: (note) => {
    pianoSounds[note].triggerAttackRelease("C4", "1m").toDestination();
  },
  playChord: (notesInChord, dispatch) => {
    dispatch(setHighlightedChord(notesInChord));
    notesInChord.forEach((note) => {
      SoundEngine.playNote(note);
    });
  },
  playArpeggio: (notesInChord, tempo, dispatch) => {
    const beatDurationInMilliseconds = (60000 / tempo) * 2;
    let delay = 0;
    if (notesInChord.length === 4) {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1);
    } else {
      delay = beatDurationInMilliseconds / (notesInChord.length - 1);
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
      noteToModify = null;
    } else if (random < 0.66) {
      noteToModify = 1;
    } else {
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

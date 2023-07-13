import { Howl } from "howler";
import { Note } from "tonal";
import { setHighlightedChord } from "../redux/slices/highlightedChordSlice";
import { Sampler, start } from "tone";
import * as Tone from "tone";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let pianoSounds = {};

for (let octave = 1; octave <= 7; octave++) {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    let noteWithOctave = `${note}${octave}`;
    let midiNote = Note.midi(noteWithOctave);
    if (midiNote) {
      pianoSounds[noteWithOctave] = new Sampler({
        urls: {
          C4: `./assets/notes/${noteWithOctave}.mp3`,
        },
      }).toDestination();
    }
  }
}

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

const drumKeys = new Tone.Players({
  urls: {
    0: "./assets/bassdrum.mp3",
    1: "./assets/snare.mp3",
    2: "./assets/hihat.mp3",
  },
}).toDestination();

const SoundEngine = {
  playNote: (note) => {
    pianoSounds[note].triggerAttackRelease("C4", "1m");
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
    console.log(Tone.context.sampleRate);
  },

  playDrumSound: (soundName) => {
    drumSounds[soundName].triggerAttackRelease("C4", "4n").toDestination();
  },
};

export default SoundEngine;

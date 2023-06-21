// NotePlayer.js
import useSound from "use-sound";

const NotePlayer = ({ note }) => {
  const file = require(`../piano-mp3/${note}.mp3`);
  const [play] = useSound(file, { volume: 1 });

  return play;
};

export default NotePlayer;

import { useSelector } from "react-redux";

const DrumProgressBar = () => {
  const currentBeat = useSelector((state) => state.drumCurrentBeat);

  return (
    <div className="drum-progress-bar">
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className={`beat ${i === currentBeat ? "active" : ""}`} />
      ))}
    </div>
  );
};

export default DrumProgressBar;

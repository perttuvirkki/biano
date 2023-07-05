const DrumProgressBar = ({ currentBeat }) => {
  return (
    <div className="drum-progress-bar">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={`beat ${i === currentBeat ? "active" : ""}`} />
      ))}
    </div>
  );
};

export default DrumProgressBar;

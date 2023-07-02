const ProgressBar = ({ currentBeat, totalBeats }) => {
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: totalBeats }, (_, i) => (
        <div
          key={i}
          style={{
            width: "20px",
            height: "20px",
            margin: "5px",
            backgroundColor: i === currentBeat ? "blue" : "gray",
          }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;

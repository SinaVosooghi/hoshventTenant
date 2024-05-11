const style = {
  position: "absolute",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  fontSize: 24,
  fontWeight: "bold",
};
export const Name = ({ id, left, top, children }) => {
  return (
    <div className="box" style={{ ...style, left, top }} data-testid="name">
      {children}
    </div>
  );
};

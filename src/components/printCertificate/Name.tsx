const style = {
  position: "absolute",
  fontSize: 22,
  fontWeight: 700,
};
export const Name = ({ id, left, top, children }) => {
  return (
    <div className="box" style={{ ...style, left, top }} data-testid="name">
      {children}
    </div>
  );
};

const style = {
  position: "absolute",
  fontSize: 24,
  fontWeight: "bold",
};
export const Name = ({ id, left, top, children }) => {
  return (
    <div
      className="box"
      style={{
        ...style,
        left,
        top,
        textAlign: "center",
        whiteSpace: "nowrap",
        color: "#000",
        width: 0,
      }}
      data-testid="name"
    >
      {children}
    </div>
  );
};

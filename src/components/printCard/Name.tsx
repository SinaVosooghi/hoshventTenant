const style = {
  position: "absolute",
  fontSize: 18,
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
      }}
      data-testid="name"
    >
      {children}
    </div>
  );
};

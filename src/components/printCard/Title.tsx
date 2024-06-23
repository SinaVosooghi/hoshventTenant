const style = {
  position: "absolute",
  fontSize: 24,
};
export const Title = ({ id, left, top, children, styles }) => {
  return (
    <div
      className="box"
      style={{
        ...style,
        left,
        top,
        textAlign: "center",
        ...styles,
        whiteSpace: "nowrap",
        width: 0,
      }}
      data-testid="title"
    >
      {children}
    </div>
  );
};

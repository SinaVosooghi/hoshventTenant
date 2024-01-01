const style = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
};
export const Logo = ({ id, left, top, children }) => {
  return (
    <div className="qrcode" style={{ ...style, left, top }} data-testid="logo">
      {children}
    </div>
  );
};

import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import ReactToPrint from "react-to-print";
import { Button } from "antd";
import { useRef } from "react";

const styles = {
  width: 1004,
  height: 531,
  position: "relative",
};

const PrintableCard = ({ boxes, name, event, qrcode, url }) => {
  const componentRef = useRef();

  const elements = boxes?.cardlayout && JSON.parse(boxes?.cardlayout);

  return (
    <div>
      <div style={{ display: "none" }}>
        <div style={styles} ref={componentRef}>
          {elements &&
            Object.keys(elements).map((key) => {
              const { left, top, title, type } = elements[key];
              if (type === "qr") {
                return (
                  <QrCode key={key} id={key} left={left} top={top}>
                    <div
                      style={{
                        width: 180,
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <ReactQrCode
                        value={url}
                        size={100}
                        viewBox={`0 0 100 100`}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#fff",
                        }}
                        renderAs="canvas"
                        id="qr"
                      />
                    </div>
                  </QrCode>
                );
              } else if (type === "name") {
                return (
                  <Name key={key} id={key} left={left} top={top}>
                    {name ?? ""}
                  </Name>
                );
              } else if (type === "title") {
                return (
                  <Title key={key} id={key} left={left} top={top}>
                    {event}
                  </Title>
                );
              } else if (type === "logo") {
                return (
                  <Logo key={key} id={key} left={left} top={top}>
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_SITE_URL + "/" + boxes?.logo
                      }`}
                      width="100%"
                      alt={"Logo"}
                    />
                  </Logo>
                );
              }
            })}
        </div>
      </div>
      <ReactToPrint
        trigger={() => <Button type="primary">پرینت کارت ورود</Button>}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default PrintableCard;

import { ReactQrCode } from "@devmehq/react-qr-code";
import { Button, Card } from "antd";
import { useRouter } from "next/router";
import reactSvgToImage from "react-svg-to-image";

const Scan = () => {
  const router = useRouter();
  const { params } = router.query;

  const qrDownloader = () => {
    reactSvgToImage("#qr", "qrcode", {
      scale: 3,
      download: true,
    });
  };

  return (
    <>
      <Card
        className="qrcode"
        title="کد ورود به رویداد"
        style={{ width: "335px" }}
      >
        <ReactQrCode
          value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${params[0]}&e=${params[1]}`}
          size={285}
          viewBox={`0 0 285 285`}
          style={{
            width: "285px",
            height: "285px",
            backgroundColor: "#fff",
          }}
          renderAs="canvas"
          id="qr"
        />

        <Button size="large" onClick={qrDownloader} block>
          دانلود QR Code
        </Button>
        <a href="path_to_file" id="link" download="qr_code"></a>
      </Card>
    </>
  );
};

export default Scan;

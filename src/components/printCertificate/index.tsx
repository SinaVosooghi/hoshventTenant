import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import ReactToPrint from "react-to-print";
import { Button } from "antd";
import { useRef, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { siteGetCertificate } from "../../shared/apollo/graphql/queries/certificate/siteGetCertificate";
import useGetSetting from "../../hooks/useGetSetting";
import Setting from "../../datamodel/Setting";
import moment from "jalali-moment";

const styles = {
  width: 1076,
  height: 832,
  position: "relative",
};

const PrintableCertificate = ({ name, event, type }) => {
  const componentRef = useRef();
  const [elements, setElements] = useState();
  const { data: siteData }: { data: Setting } = useGetSetting();

  const { data, loading: fetchCertificate } = useQuery(siteGetCertificate, {
    notifyOnNetworkStatusChange: true,
    //@ts-ignore
    variables: { type: type },
    fetchPolicy: "network-only",
    onCompleted: async ({ getCertificate }) => {
      setElements(JSON.parse(getCertificate.itemLayout));
    },
  });

  return (
    <div>
      <div style={{ display: "none" }}>
        <div
          style={{
            ...styles,
            ...(data?.getCertificate?.image && {
              backgroundImage: `url('${process.env.NEXT_PUBLIC_SITE_URL}/${data?.getCertificate?.image}')`,
              backgroundSize: "cover",
            }),
          }}
          ref={componentRef}
        >
          {elements &&
            Object.keys(elements).map((key) => {
              const { left, top, title, type } = elements[key];
              if (type === "name") {
                return (
                  <Name key={key} id={key} left={left} top={top}>
                    {name ?? ""}
                  </Name>
                );
              } else if (type === "date") {
                return (
                  <Title key={key} id={key} left={left} top={top}>
                    {moment().locale("fa").format("D MMM YYYY")}
                  </Title>
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
                        process.env.NEXT_PUBLIC_SITE_URL + "/" + siteData.logo
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
        trigger={() => <Button loading={fetchCertificate}>پرینت مدرک</Button>}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default PrintableCertificate;

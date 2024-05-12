import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import ReactToPrint from "react-to-print";
import { Button, Card, Flex } from "antd";
import { useRef } from "react";
import { useQuery } from "@apollo/client";
import { siteGetUser } from "../../shared/apollo/graphql/queries/user/siteGetUser";

const styles = {
  width: 1004,
  height: 531,
  position: "relative",
};

const PrintableCard = ({
  form,
  boxes,
  name,
  event,
  url,
  user,
  showCard = false,
  showThumbnail,
  handleCancel,
}: any) => {
  const componentRef = useRef();

  const elements = boxes?.cardlayout && JSON.parse(boxes?.cardlayout);
  const { data, loading } = useQuery(siteGetUser, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      id: parseInt(user.uid),
    },
  });

  return (
    <>
      <div>
        <Flex onClick={() => handleCancel()}>
          <ReactToPrint
            onAfterPrint={() => {
              form?.resetFields();
            }}
            trigger={() => (
              <Button type="primary" loading={loading}>
                پرینت کارت ورود
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Flex>

        <div
          style={{
            display: showCard ? "block" : "none",
            transform: showCard ? "scale(0.6)" : "",
          }}
        >
          <div style={{ ...styles }} ref={componentRef}>
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
                } else if (type === "usertitle") {
                  return (
                    <Title key={key} id={key} left={left} top={top}>
                      {data?.user?.title ?? user?.title}
                    </Title>
                  );
                } else if (type === "titleen") {
                  return (
                    <Title key={key} id={key} left={left} top={top}>
                      {data?.user?.titleen ?? user?.titleen}
                    </Title>
                  );
                } else if (type === "nameen") {
                  return (
                    <Title
                      key={key}
                      id={key}
                      left={left}
                      top={top}
                      style={{ fontWeight: "bold" }}
                    >
                      {data?.user?.firstNameen ?? user?.firstNameen}{" "}
                      {data?.user?.lastNameen ?? user?.lastNameen}
                    </Title>
                  );
                } else if (type === "categoryen") {
                  return (
                    <Title key={key} id={key} left={left} top={top}>
                      {data?.user?.category?.titleen ?? user?.category?.titleen}
                    </Title>
                  );
                } else if (type === "category") {
                  return (
                    <Title key={key} id={key} left={left} top={top}>
                      {data?.user?.category?.title || user?.category?.title}
                    </Title>
                  );
                } else if (type === "parent") {
                  console.log(data?.user?.category, user?.category);
                  return (
                    <Title key={key} id={key} left={left} top={top}>
                      {data?.user?.category?.category?.title ||
                        user?.category?.category?.title}
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
      </div>
      {showThumbnail && (
        <div
          style={{
            width: 1004,
            height: 531,
            position: "relative",
            transform: "scale(0.7)",
          }}
          className="printCard"
        >
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
              } else if (type === "nameen") {
                return (
                  <Title key={key} id={key} left={left} top={top}>
                    {data?.user?.firstNameen} {data?.user?.lastNameen}
                  </Title>
                );
              } else if (type === "categoryen") {
                return (
                  <Title key={key} id={key} left={left} top={top}>
                    {data?.user?.category?.titleen}
                  </Title>
                );
              } else if (type === "category") {
                return (
                  <Title key={key} id={key} left={left} top={top}>
                    {data?.user?.category?.title}
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
      )}
    </>
  );
};

export default PrintableCard;

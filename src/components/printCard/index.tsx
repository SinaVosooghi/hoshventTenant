import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import ReactToPrint from "react-to-print";
import { Button, Card, Flex } from "antd";
import { useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { siteGetUser } from "../../shared/apollo/graphql/queries/user/siteGetUser";
import { siteCreatePrint } from "../../shared/apollo/graphql/mutations/print/create";
import useDownloadCardPdf from "../../hooks/useDownloadCardPdf";

const styles = {
  width: "7in",
  height: "9.25in",
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
      id: parseInt(user?.id),
    },
  });

  const [createPrint] = useMutation(siteCreatePrint);

  const { downloadBatchCardPdf } = useDownloadCardPdf();

  // const [triggerMutation] = useMutation(someMutation, {
  //   variables: {
  //     id: parseInt(user.uid),
  //     // Add other necessary variables here
  //   },
  //   onCompleted: () => {
  //     console.log("Mutation completed");
  //   },
  // });

  const handlePrintClick = () => {
    createPrint({
      variables: {
        input: {
          user: parseInt(user.id),
          site: parseInt(process.env.NEXT_PUBLIC_SITE || ""),
        },
      },
    });
  };

  const users = [
    {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      title: user.title ?? "",
      enTitle: user.titleen ?? "",
      qrUrl: `${process.env.NEXT_PUBLIC_BASE_API + "/graphql"}/scan&u=${
        user.id
      }`,
      header: ``,
    },
  ];

  const savePrintCards = () => {
    downloadBatchCardPdf(users);
    form?.resetFields();
  };

  return (
    <>
      <div>
        <Flex onClick={() => handleCancel && handleCancel()}>
          <Button type="primary" loading={loading} onClick={savePrintCards}>
            پرینت کارت ورود
          </Button>
        </Flex>

        <div
          style={{ ...styles, transform: "scale(.94)", display: "block" }}
          ref={componentRef}
        >
          {elements &&
            Object.keys(elements).map((key) => {
              const { left, top, title, type } = elements[key];
              if (type === "qr") {
                return (
                  <QrCode key={key} id={key} left={left} top={top}>
                    <div
                      style={{
                        width: 130,
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <ReactQrCode
                        value={url}
                        size={130}
                        viewBox={`0 0 130 130`}
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
    </>
  );
};

export default PrintableCard;

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  notification,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import moment from "jalali-moment";
import { ReactQrCode } from "@devmehq/react-qr-code";
import ReactToPrint from "react-to-print";
import { siteGetTimeline } from "../../src/shared/apollo/graphql/queries/timeline/siteGetTimeline";
import { siteCheckin } from "../../src/shared/apollo/graphql/mutations/timeline/siteChekin";
import { siteCheckout } from "../../src/shared/apollo/graphql/mutations/timeline/siteCheckout";
import PrintableCard from "../../src/components/printCard";
import { siteGetUserByMobileNumber } from "../../src/shared/apollo/graphql/queries/user/siteGetUserByMobile";
import useGetSetting from "../../src/hooks/useGetSetting";
import Setting from "../../src/datamodel/Setting";
import { User } from "../../src/datamodel";
import { NextSeo } from "next-seo";

require("./style.less");

const Scanner = () => {
  const [user, setUser] = useState<User>();
  const { data: siteData }: { data: Setting } = useGetSetting();
  const [showError, setShowError] = useState(false);

  const [getUserInfo, { loading }] = useLazyQuery(siteGetUserByMobileNumber, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ userByMobile }) => {
      setUser(userByMobile);
    },
    onError: () => {
      setShowError(true);
      notification.warning({ message: "موردی یافت نشد!" });
    },
  });

  const onFinish = (values: any) => {
    setShowError(false);
    // @ts-ignore
    setUser(null);
    if (values.mobileNumber) {
      getUserInfo({
        variables: { input: { mobilenumber: values.mobileNumber } },
      });
    }
    if (values.nationalcode) {
      getUserInfo({
        variables: { input: { nationalcode: values.nationalcode.toString() } },
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('${
          process.env.NEXT_PUBLIC_SITE_URL + "/" + siteData?.banner
        }')`,
        backgroundPositionY: 299,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <img src="/assets/print-header.jpg" width={"100%"} />
      <NextSeo nofollow noindex title="پرینت کارت" />
      <Row justify={"center"} align="top" style={{ height: "100vh" }}>
        <Col md={6} xs={22}>
          <Card
            id="scanner"
            style={{ margin: "50px 0" }}
            title="گرفتن کارت ورود"
          >
            {showError && (
              <Alert
                message={"موردی یافت نشد!"}
                type="error"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}

            <Form
              name="basic"
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
              autoComplete="off"
            >
              {siteData?.isNationalCode === "ncode" ? (
                <Form.Item
                  label="کد ملی"
                  name="nationalcode"
                  rules={[
                    {
                      required: true,
                      message: "لطفا کدملی را وارد کنید!",
                    },
                  ]}
                >
                  <Input size="large" type="number" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="شماره موبایل"
                  name="mobileNumber"
                  rules={[
                    {
                      required: true,
                      message: "لطفا شماره موبایل را وارد کنید!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  جستجو
                </Button>
              </Form.Item>
            </Form>
            {user && (
              <PrintableCard
                boxes={siteData}
                name={`${user?.firstName} ${user?.lastName}`}
                event={"کارت ورود"}
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Scanner;

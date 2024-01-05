import { useLazyQuery } from "@apollo/client";
import { Alert, Button, Card, Col, Form, Input, Row, notification } from "antd";
import { useState } from "react";
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
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();

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

  const handleBackspaceClick = () => {
    const currentInput =
      form.getFieldValue("nationalcode") ||
      form.getFieldValue("mobileNumber") ||
      "";
    form.setFieldsValue({ mobileNumber: currentInput.slice(0, -1) });
  };

  const handleKeyboardClick = (value) => {
    const currentInput =
      form.getFieldValue("nationalcode") ||
      form.getFieldValue("mobileNumber") ||
      "";
    form.setFieldValue("mobileNumber", currentInput + value);
  };

  const customNumberKeyboard = (
    <div className="custom-keyboard">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((number) => (
        <Button key={number} onClick={() => handleKeyboardClick(number)}>
          {number}
        </Button>
      ))}
      <Button onClick={handleBackspaceClick} className="backspace-button">
        ⌫
      </Button>
    </div>
  );

  return (
    <>
      <NextSeo nofollow noindex title="پرینت کارت" />
      <div
        id="scanner"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + siteData?.banner
          }')`,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <Row justify={"center"} align="top">
          <Col md={6} xs={22}>
            <Card title="گرفتن کارت ورود">
              {showError && (
                <Alert
                  message={"موردی یافت نشد!"}
                  type="error"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              )}

              <Form
                form={form}
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
                    <Input size="large" type="number" readOnly />
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
                    <Input size="large" readOnly />
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
              {customNumberKeyboard}
              {user && (
                <PrintableCard
                  boxes={siteData}
                  name={`${user?.firstName} ${user?.lastName}`}
                  event={"کارت ورود"}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
                  user={user}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Scanner;

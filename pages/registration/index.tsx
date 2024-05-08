import { useLazyQuery } from "@apollo/client";
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  notification,
} from "antd";
import { useState } from "react";
import PrintableCard from "../../src/components/printCard";
import { siteGetUserByMobileNumber } from "../../src/shared/apollo/graphql/queries/user/siteGetUserByMobile";
import useGetSetting from "../../src/hooks/useGetSetting";
import Setting from "../../src/datamodel/Setting";
import { User } from "../../src/datamodel";
import { NextSeo } from "next-seo";
import moment from "jalali-moment";

require("./style.less");

const Scanner = () => {
  const [user, setUser] = useState<User>();
  const { data: siteData }: { data: Setting } = useGetSetting();
  const [showError, setShowError] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getUserInfo, { loading }] = useLazyQuery(siteGetUserByMobileNumber, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ userByMobile }) => {
      setUser(userByMobile);
      setIsModalOpen(true);
    },
    onError: (err) => {
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleBackspaceClick = () => {
    const currentInput =
      form.getFieldValue("nationalcode") ||
      form.getFieldValue("mobileNumber") ||
      "";
    form.setFieldsValue({ mobileNumber: currentInput.slice(0, -1) });
  };

  const handleKeyboardClick = (value) => {
    if (value === "Clear") {
      form.setFieldValue("mobileNumber", "");
      return;
    }
    const currentInput =
      form.getFieldValue("nationalcode") ||
      form.getFieldValue("mobileNumber") ||
      "";
    form.setFieldValue("mobileNumber", currentInput + value);
  };

  const customNumberKeyboard = (
    <div className="custom-keyboard">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0].map((number) => (
        <Button key={number} onClick={() => handleKeyboardClick(number)}>
          {number}
        </Button>
      ))}
      <Button onClick={handleBackspaceClick} className="backspace-button">
        ⌫
      </Button>
    </div>
  );

  const renderUsertype = (type: string) => {
    let t = "کاربر";
    switch (type) {
      case "user":
        t = "کاربر";
        break;
      case "lecturer":
        t = "سخنران";
        break;
      case "instructor":
        t = "عوامل اجرایی";
        break;
      case "tenant":
        t = "مدریر سایت";
        break;
      case "guest":
        t = "میهمان";
        break;
    }

    return t;
  };

  return (
    <>
      <NextSeo nofollow noindex title="پرینت کارت" />
      <div id="scanner" style={{ display: "flex", flexDirection: "column" }}>
        <Image
          src={process.env.NEXT_PUBLIC_SITE_URL + "/" + siteData?.banner}
          alt="rasta"
          preview={false}
          style={{ marginBottom: 20 }}
        />
        <Row justify={"center"} align="top">
          <Col md={6} xs={22}>
            <Card title="دریافت کارت ورود">
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
              {customNumberKeyboard}
              <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                footer={[
                  <Button key={1} onClick={handleCancel}>
                    بستن
                  </Button>,
                ]}
              >
                {user && (
                  <div id="user-profile" style={{ marginTop: 12 }}>
                    <div className="card-container" id="card">
                      <span className="pro">
                        {renderUsertype(user?.usertype)}
                      </span>

                      <h3 style={{ textAlign: "right", marginRight: 30 }}>
                        {user?.firstName} {user?.lastName}
                      </h3>

                      <h3 style={{ textAlign: "right", marginRight: 30 }}>
                        {user?.firstNameen} {user?.lastNameen}
                      </h3>
                      <h5 style={{ textAlign: "right", marginRight: 30 }}>
                        {user?.mobilenumber}
                      </h5>
                      <p style={{ textAlign: "right", marginRight: 30 }}>
                        <b>
                          {user?.email} <br /> عضویت:{" "}
                        </b>
                        {moment(user?.created)
                          .locale("fa")
                          .format("ddd D MMM, YYYY")}
                      </p>
                    </div>
                  </div>
                )}

                <Flex style={{ marginTop: 12 }} gap={12} justify="center">
                  {user && (
                    <PrintableCard
                      boxes={siteData}
                      name={`${user?.firstName} ${user?.lastName}`}
                      event={"کارت ورود"}
                      url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
                      user={user}
                      form={form}
                      setUser={setUser}
                      handleCancel={handleCancel}
                    />
                  )}
                  <p>لطفا کارت ورود را از روی پرینتر بردارید</p>
                  {/* {user && (
                  <PrintableCertificate
                  type="workshop"
                  event={record.workshop.title}
                  name={user?.firstName + " " + user?.lastName}

                    boxes={siteData}
                    name={`${user?.firstName} ${user?.lastName}`}
                    event={"کارت ورود"}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
                    user={user}
                    form={form}
                    setUser={setUser}
                  />
                )} */}
                </Flex>
              </Modal>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Scanner;

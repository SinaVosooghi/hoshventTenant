import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  notification,
  Result,
  Row,
  Space,
} from "antd";

import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { validateMessages } from "../../src/util/messageValidators";
import { NextSeo } from "next-seo";
import useGetSetting from "../../src/hooks/useGetSetting";
import Setting from "../../src/datamodel/Setting";

require("./style.less");

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const router = useRouter();
  const { data: siteData }: { data: Setting } = useGetSetting();

  const onFinish = ({
    password,
    email,
    remember,
    mobilenumber,
    firstName,
    lastName,
    nationalcode,
  }: any) => {
    axios
      .post(process.env.NEXT_PUBLIC_SITE_URL + "/auth/register", {
        email,
        password,
        remember,
        mobilenumber,
        lastName,
        firstName,
        nationalcode,
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      })
      .then(({ data }) => {
        setLoading(false);

        const { firstName, lastName } = data;

        setCreated(true);
        notification.success({
          message: firstName + " " + lastName,
          description: "حساب کاربری شما ایجاد شد",
        });
      })
      .catch((errors) => {
        setLoading(false);
        if (
          errors?.response?.data?.message ===
          "Already exist, User with this mobile!"
        ) {
          notification.error({ message: "موبایل وارد شده تکراریست!" });
        } else if (errors?.response?.data.statusCode === 401) {
          notification.error({ message: "دسترسی غیر مجاز" });
        } else if (
          errors?.response?.data?.message ===
          "Already exist, User with this email!"
        ) {
          notification.error({ message: "ایمیل وارد شده تکراریست!" });
        } else {
          notification.error({ message: "اطلاعات ورود اشتباه است" });
        }
      });
  };

  return (
    <>
      <NextSeo title={"ثبت نام"} description={"ثبت نام در سایت"} />
      <div id="kiosk" style={{ display: "flex", flexDirection: "column" }}>
        <Image
          src={process.env.NEXT_PUBLIC_SITE_URL + "/" + siteData?.banner}
          alt="rasta"
          preview={false}
          style={{ marginBottom: 20 }}
        />
        <Row align="middle" justify="center">
          {created ? (
            <Result
              status="success"
              title="حساب کاربری ساخته شد"
              subTitle="حساب کاربری شما با موفقیت ایجاد شد."
              extra={[
                <Button
                  key="buy"
                  type="primary"
                  size="large"
                  onClick={() => setCreated(false)}
                >
                  بازگشت به کیوسک
                </Button>,
              ]}
            />
          ) : (
            <Col md={8}>
              <div id="login-card">
                <h1>ثبت نام در رویداد</h1>
                <p>
                  با ورود و یا ثبت نام در سایت شما شرایط و قوانین استفاده از
                  سرویس های سایت و قوانین حریم خصوصی آن را می‌پذیرید
                </p>
                <Row justify="center" id="login-form" gutter={[8, 16]}>
                  <Col md={20} xs={22}>
                    <Form
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      autoComplete="off"
                      size="large"
                      validateMessages={validateMessages}
                    >
                      <Form.Item
                        label="نام"
                        name="firstName"
                        hasFeedback
                        rules={[{ required: true }]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        label="نام خانوادگی"
                        name="lastName"
                        hasFeedback
                        rules={[{ required: true }]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        label="نام (انگلیسی)"
                        name="firstNameen"
                        hasFeedback
                        rules={[{ required: true }]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        label="نام خانوادگی (انگلیسی)"
                        name="lastNameen"
                        hasFeedback
                        rules={[{ required: true }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                      <Form.Item
                        label="ایمیل"
                        name="email"
                        hasFeedback
                        rules={[{ required: true, type: "email" }]}
                      >
                        <Input size="large" placeholder="john@doe.com" />
                      </Form.Item>

                      <Form.Item
                        label="کدملی"
                        name="nationalcode"
                        hasFeedback
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          size="large"
                          placeholder="12345568"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="شماره موبایل"
                        name="mobilenumber"
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            type: "number",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          size="large"
                          maxLength={11}
                          placeholder="09121232323"
                        />
                      </Form.Item>

                      <Form.Item
                        label="رمزعبور"
                        name="password"
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            min: 6,
                          },
                        ]}
                      >
                        <Input.Password size="large" />
                      </Form.Item>

                      <Form.Item
                        name="confirm"
                        label="تایید رمزعبور"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "لطفا رمز عبور خود را تایید کنید!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "رمز جدیدی که وارد کردید مطابقت ندارد!"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>

                      <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>به خاطر سپاری</Checkbox>
                      </Form.Item>

                      <div className="register-link">
                        <p>قبلا ثبت نام کرده اید؟ </p>
                        <Link href={"/login"}>وارد شوید.</Link>
                      </div>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          loading={loading}
                        >
                          ورود
                        </Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

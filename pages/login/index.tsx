import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Space,
} from "antd";

import { Dispatch } from "../../src/shared/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import {
  checkLogin,
  getUserFromCookie,
  handleLogin,
} from "../../src/util/utils";
import CategoriesSlider from "../../src/components/categoriesSlider";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { validateMessages } from "../../src/util/messageValidators";
import { NextSeo } from "next-seo";

require("./style.less");

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = ({ password, email, remember }: any) => {
    setLoading(true);
    axios
      .post(process.env.NEXT_PUBLIC_SITE_URL + "/auth/login", {
        email,
        password,
        remember,
        s: process.env.NEXT_PUBLIC_SITE,
      })
      .then(({ data }) => {
        setLoading(false);

        const { type, access_token, firstName, lastName } = data;
        const loginData = {
          ...data,
          accessToken: access_token,
          ability: [
            {
              action: "manage",
              subject: "all",
            },
          ],
        };
        if (handleLogin(loginData)) {
          notification.success({
            message: firstName + " " + lastName,
            description: "شما وارد حساب کاربریتان شدید",
          });
          if (type === "instructor") {
            router.push("/dashboard");
          } else if (type === "user") {
            router.push("/panel");
          } else {
            router.push("/panel");
          }
        }
      })
      .catch((errors) => {
        setLoading(false);
        if ("You do not have access to this page!") {
          notification.error({
            message: "شما اجازه ورود به این صفحه را ندارید!",
          });
        } else if (errors?.response?.data.statusCode === 401) {
          notification.error({ message: "دسترسی غیر مجاز" });
        } else {
          notification.error({ message: "اطلاعات ورود اشتباه است" });
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo.message);
  };

  useEffect(() => {
    if (checkLogin()) router.push("/dashboard");
  }, []);

  useEffect(() => {
    if (getUserFromCookie()) {
      if (getUserFromCookie()?.type === "instructor") {
        router.push("/dashboard");
      } else if (getUserFromCookie()?.type === "user") {
        router.push("/panel");
      } else {
        router.push("/panel");
      }
    }
  }, []);

  return (
    <>
      <NextSeo title={"ورود"} description={"ورود در سایت"} />
      <div id="login-page">
        <MainBreadCrumb activeItem="ثبت نام/ ورود" />
        <Row align="middle" justify="center">
          <Col md={10}>
            <div id="login-card">
              <h1>ورود به حساب کاربری</h1>
              <p>
                با ورود و یا ثبت نام در سایت شما شرایط و قوانین استفاده از سرویس
                های سایت و قوانین حریم خصوصی آن را می‌پذیرید
              </p>
              <Row justify="center" id="login-form" gutter={[8, 16]}>
                <Col md={20} xs={22}>
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    validateMessages={validateMessages}
                  >
                    <Form.Item
                      label="ایمیل"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="john@doe.com" />
                    </Form.Item>

                    <Form.Item
                      label="رمزعبور"
                      name="password"
                      rules={[
                        {
                          required: true,
                          min: 6,
                        },
                      ]}
                    >
                      <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>به خاطر سپاری</Checkbox>
                    </Form.Item>

                    <div className="register-link">
                      <p>قبلا ثبت نام نکرده اید؟ </p>
                      <Link href={"/register"}>ثبت نام کنید.</Link>
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
          <Col md={22}>
            <CategoriesSlider />
          </Col>
        </Row>
      </div>
    </>
  );
}

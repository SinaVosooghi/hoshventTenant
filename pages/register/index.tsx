import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Space,
} from "antd";

import { Dispatch } from "../../src/shared/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { checkLogin, handleLogin } from "../../src/util/utils";
import CategoriesSlider from "../../src/components/categoriesSlider";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { validateMessages } from "../../src/util/messageValidators";
import { NextSeo } from "next-seo";
import useGetSetting from "../../src/hooks/useGetSetting";

require("./style.less");

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data } = useGetSetting();

  const onFinish = ({
    password,
    email,
    remember,
    mobilenumber,
    firstName,
    lastName,
  }: any) => {
    return false;
    setLoading(true);
    axios
      .post(process.env.NEXT_PUBLIC_SITE + "/auth/register", {
        email,
        password,
        remember,
        mobilenumber,
        lastName,
        firstName,
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
          if (type === "teacher") {
            router.push("/dashboard");
          } else if (type === "student") {
            router.push("/panel");
          }
        }
      })
      .catch((errors) => {
        setLoading(false);
        if (errors?.response?.data.statusCode === 401) {
          notification.error({ message: "دسترسی غیر مجاز" });
        } else {
          notification.error({ message: "اطلاعات ورود اشتباه است" });
        }
      });
  };

  useEffect(() => {
    if (checkLogin()) router.push("/dashboard");
  }, []);

  return (
    <>
      <NextSeo title={"ثبت نام"} description={"ثبت نام در سایت"} />
      <div id="login-page">
        <MainBreadCrumb activeItem="ثبت نام/ ورود" />
        <Row align="middle" justify="center">
          <Col md={10}>
            <div id="login-card">
              <h1>ثبت نام در {data?.companyName}</h1>
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
                    autoComplete="off"
                    validateMessages={validateMessages}
                  >
                    <Form.Item
                      label="نام"
                      name="firstName"
                      rules={[{ required: true, min: 4 }]}
                    >
                      <Input size="large" />
                    </Form.Item>

                    <Form.Item
                      label="نام خانوادگی"
                      name="lastName"
                      rules={[{ required: true, min: 4 }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      label="ایمیل"
                      name="email"
                      rules={[{ required: true, type: "email" }]}
                    >
                      <Input size="large" placeholder="john@doe.com" />
                    </Form.Item>

                    <Form.Item
                      label="شماره موبایل"
                      name="mobilenumber"
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
          <Col md={22}>
            <CategoriesSlider />
          </Col>
        </Row>
      </div>
    </>
  );
}

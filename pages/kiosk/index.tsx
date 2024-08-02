import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Result,
  Row,
  Select,
  message,
  notification,
} from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Category from "../../src/datamodel/Category";
import { CloseOutlined } from "@ant-design/icons";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Webcam from "react-webcam";
import axios from "axios";
import { siteGetCategories } from "../../src/shared/apollo/graphql/queries/category/siteGetCategories";
import { siteUploadImage } from "../../src/shared/apollo/graphql/mutations/upload/upload";
import useGetSetting from "../../src/hooks/useGetSetting";
import { useRouter } from "next/router";
import { validateMessages } from "../../src/util/messageValidators";

require("./style.less");

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { data: siteData }: { data: Setting } = useGetSetting();

  const { data, loading: categoryLoading } = useQuery(siteGetCategories, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        featured: true,
        status: true,
        type: "user",
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
    }
  }, [webcamRef]);

  const [uploadImageMutation] = useMutation(siteUploadImage, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    onCompleted: ({ uploadImage }) => {
      setImageUrl(uploadImage);
    },
  });

  const uploadImage = async (imageData: File | Blob | string) => {
    try {
      let file;
      if (typeof imageData === "string") {
        const response = await fetch(imageData);
        const blob = await response.blob();
        // Generate a random filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const filename = `kiosk-${randomString}-${timestamp}.jpg`;
        file = new File([blob], filename, { type: blob.type });
      } else {
        // If imageData is a File or Blob, use a random filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const filename = `kiosk-${randomString}-${timestamp}.jpg`;
        file = new File([imageData], filename, { type: imageData.type });
      }
      const { data } = await uploadImageMutation({
        variables: {
          input: {
            image: file,
          },
        },
      });

      return data.uploadImage;
    } catch (error) {
      console.error("Error uploading image:", error);
      notification.error({
        message: "بارگذاری تصویر با خطا مواجه شد",
        description:
          "در بارگذاری تصویر شما مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.",
      });
      throw error;
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (imageSrc) {
        await uploadImage(imageSrc).then(async (e) => {
          if (e) {
            await axios
              .post(process.env.NEXT_PUBLIC_SITE_URL + "/auth/register", {
                ...values,
                // @ts-ignore
                ...(e && { avatar: e }),
                // @ts-ignore
                siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
              })
              .then((response) => {
                setImageSrc(null);
                setImageUrl(null);
                const { firstName, lastName } = response.data;
                setCreated(true);
                notification.success({
                  message: `${firstName} ${lastName}`,
                  description: "حساب کاربری شما با موفقیت ایجاد شد.",
                });
              })
              .catch((e) => {
                if (
                  e?.response?.data?.message ===
                  "Already exist, User with this mobile!"
                ) {
                  notification.error({ message: "موبایل وارد شده تکراریست!" });
                } else if (e?.response?.data.statusCode === 401) {
                  notification.error({ message: "دسترسی غیر مجاز" });
                } else if (
                  e?.response?.data?.message ===
                  "Already exist, User with this email!"
                ) {
                  notification.error({ message: "ایمیل وارد شده تکراریست!" });
                } else {
                  notification.error({ message: "اطلاعات ورود اشتباه است" });
                }
              });

            setLoading(false);
          }
        });
        setLoading(false);
      } else {
        await axios
          .post(process.env.NEXT_PUBLIC_SITE_URL + "/auth/register", {
            ...values,
            // @ts-ignore
            ...(imageUrl && { avatar: imageUrl }),
            // @ts-ignore
            siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
          })
          .then((response) => {
            return false;
            setImageSrc(null);
            setImageUrl(null);
            const { firstName, lastName } = response.data;
            setCreated(true);
            notification.success({
              message: `${firstName} ${lastName}`,
              description: "حساب کاربری شما با موفقیت ایجاد شد.",
            });
          })
          .catch((e) => {
            if (
              e?.response?.data?.message ===
              "Already exist, User with this mobile!"
            ) {
              notification.error({ message: "موبایل وارد شده تکراریست!" });
            } else if (e?.response?.data.statusCode === 401) {
              notification.error({ message: "دسترسی غیر مجاز" });
            } else if (
              e?.response?.data?.message ===
              "Already exist, User with this email!"
            ) {
              notification.error({ message: "ایمیل وارد شده تکراریست!" });
            } else {
              notification.error({ message: "اطلاعات ورود اشتباه است" });
            }
          });

        setLoading(false);
      }
    } catch (errors) {
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
      }
    }
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
            <Col md={14}>
              <div id="login-card">
                <h1>ثبت نام در رویداد</h1>
                <p>
                  با ورود و یا ثبت نام در سایت شما شرایط و قوانین استفاده از
                  سرویس های سایت و قوانین حریم خصوصی آن را می‌پذیرید
                </p>
                <Row justify="center" id="login-form" gutter={[8, 16]}>
                  <Col md={23} xs={22}>
                    <Form
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      autoComplete="off"
                      layout="vertical"
                      size="large"
                      validateMessages={validateMessages}
                    >
                      <Row gutter={[16, 16]}>
                        {/* Form Items */}
                        <Col md={6}>
                          <Form.Item
                            label="نام"
                            name="firstName"
                            hasFeedback
                            rules={[{ required: true }]}
                          >
                            <Input size="large" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
                          <Form.Item
                            label="نام خانوادگی"
                            name="lastName"
                            hasFeedback
                            rules={[{ required: true }]}
                          >
                            <Input size="large" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
                          <Form.Item label="نام (انگلیسی)" name="firstNameen">
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
                          <Form.Item
                            label="نام خانوادگی (انگلیسی)"
                            name="lastNameen"
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col md={6}>
                          <Form.Item label="عنوان (انگلیسی)" name="title">
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
                          <Form.Item label="عنوان" name="titleen">
                            <Input size="large" />
                          </Form.Item>
                        </Col>

                        <Col md={6}>
                          <Form.Item
                            label="ایمیل"
                            name="email"
                            hasFeedback
                            rules={[{ required: true, type: "email" }]}
                          >
                            <Input size="large" placeholder="john@doe.com" />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
                          <Form.Item label="دسته بندی" name="category">
                            <Select
                              placeholder="انتخاب دسته بندی"
                              loading={categoryLoading}
                              allowClear
                              showSearch
                            >
                              {data?.categoriesApi?.categories?.map(
                                (category: Category) => (
                                  <Select.Option
                                    value={category.id}
                                    key={category.id}
                                  >
                                    {category.title}
                                    {category.titleen &&
                                      `${" - "} ${category.titleen}`}
                                  </Select.Option>
                                )
                              )}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col md={6}>
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
                        </Col>

                        <Col md={6}>
                          <Form.Item
                            label="شماره موبایل"
                            name="mobilenumber"
                            hasFeedback
                            rules={[{ required: true, type: "number" }]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              size="large"
                              maxLength={11}
                              placeholder="09121232323"
                            />
                          </Form.Item>
                        </Col>

                        <Col md={6}>
                          <Form.Item
                            label="رمزعبور"
                            name="password"
                            hasFeedback
                            rules={[{ required: true, min: 6 }]}
                          >
                            <Input.Password size="large" />
                          </Form.Item>
                        </Col>
                        <Col md={6}>
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
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Form.Item label="تصویر از وبکم">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start",
                                columnGap: 10,
                              }}
                            >
                              <div
                                style={{
                                  display: "inline-flex",
                                  flexDirection: "column",
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    width: 320,
                                    height: 240,
                                  }}
                                >
                                  <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={320}
                                    height={240}
                                  />
                                </div>
                                <Button
                                  onClick={capture}
                                  style={{ marginTop: 10 }}
                                >
                                  گرفتن عکس
                                </Button>
                              </div>
                              {imageSrc && (
                                <div
                                  style={{
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    gap: 10,
                                  }}
                                >
                                  <Image
                                    style={{
                                      borderRadius: 320,
                                      overflow: "hidden",
                                      border: "4px dashed #ccc",
                                      objectFit: "cover",
                                    }}
                                    src={imageSrc}
                                    alt="Captured"
                                    width={240}
                                    height={240}
                                  />
                                  <Button
                                    type="primary"
                                    danger
                                    onClick={() => {
                                      setImageSrc(null);
                                      setImageUrl(null);
                                    }}
                                    icon={<CloseOutlined rev={undefined} />}
                                  >
                                    حذف عکس
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>

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

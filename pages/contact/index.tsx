import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Row, message } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CategoriesSlider from "../../src/components/categoriesSlider";
import { NextSeo } from "next-seo";
import { siteCreateContact } from "../../src/shared/apollo/graphql/mutations/contact/create";
import { useMutation } from "@apollo/client";
import useGetSetting from "../../src/hooks/useGetSetting";
// @ts-ignore
import { Fade } from "react-reveal";
import { memo } from "react";
import Link from "next/link";

require("./style.less");

const { TextArea } = Input;

const Contact = () => {
  const { data } = useGetSetting();
  const [form] = Form.useForm();

  const [send, { loading }] = useMutation(siteCreateContact, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (!data?.validate) {
        message.success("پیام شما با موفقیت ارسال شد");
        form.resetFields();
      }
    },
    onError: (err) => {
      message.error("خطا در ارسال پیام");
    },
  });

  const onFinish = (values: any) => {
    send({
      variables: {
        input: {
          name: values.name,
          body: values.body,
          email: values.email,
          subject: values.subject,
        },
      },
    });
  };

  return (
    <>
      <NextSeo title="تماس با ما" />
      <div id="contact">
        <MainBreadCrumb activeItem="تماس باما" />
        <Row justify="center" align="middle">
          <Col md={20} xs={24} id="contact-container">
            <Row className="contact-container">
              <Col md={3} xs={24} className="contact-col">
                <Fade>
                  <img
                    src="/assets/contact/logo.png"
                    alt="slide"
                    className="map"
                  />
                </Fade>
              </Col>
              <Col md={12} xs={24} className="contact-col">
                <div className="contact-title">
                  <div>
                    <h1>تماس با ما</h1>
                    <p>
                      راه های ارتباط با <span>موسسه رستا</span>
                    </p>
                  </div>
                  <div className="about-socials">
                    {data?.twitter && (
                      <span>
                        <Link href={data?.twitter}>
                          <TwitterOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}

                    {data?.linkedin && (
                      <span>
                        <Link href={data?.linkedin}>
                          <LinkedinOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}

                    {data?.instagram && (
                      <span>
                        <Link href={data?.instagram}>
                          <InstagramOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}

                    {data?.whatsapp && (
                      <span>
                        <Link href={data?.whatsapp}>
                          <WhatsAppOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}
                    {data?.youtube && (
                      <span>
                        <Link href={data?.youtube}>
                          <YoutubeOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}
                    {data?.facebook && (
                      <span>
                        <Link href={data?.facebook}>
                          <FacebookOutlined rev={undefined} />
                        </Link>
                      </span>
                    )}
                  </div>
                </div>
                <div className="contact-tip">
                  <p>
                    لطفاً پیش از ارسال ایمیل یا تماس تلفنی، ابتدا{" "}
                    <strong>پرسش‌های متداول</strong> را مشاهده کنید{" "}
                  </p>
                </div>

                <div className="contact-info">
                  <div className="contact-info-column">
                    <div className="contact-info-item">
                      <img
                        src="/assets/contact/pin.png"
                        alt="pin"
                        width={42}
                        height={42}
                      />
                      <div>
                        <span>آدرس</span>
                        <p>{data?.address}</p>
                      </div>
                    </div>
                    <div className="contact-info-item">
                      <img
                        src="/assets/contact/call.png"
                        alt="pin"
                        width={42}
                        height={42}
                      />
                      <div>
                        <span>پشتیبانی</span>
                        <h2>{data?.phoneNumber}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="contact-info-column">
                    {data?.whatsapp && (
                      <div className="contact-info-item">
                        <img
                          src="/assets/contact/whatsapp.png"
                          alt="pin"
                          width={42}
                          height={42}
                        />
                        <div>
                          <span>واتساپ - پاسخگویی به سوالات فنی</span>
                          <p>{data?.whatsapp}</p>
                        </div>
                      </div>
                    )}
                    {data?.email && (
                      <div className="contact-info-item">
                        <img
                          src="/assets/contact/call.png"
                          alt="pin"
                          width={42}
                          height={42}
                        />
                        <div>
                          <span>ایمیل</span>
                          <p>{data?.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <div id="contact-form">
              <h1>فرم تماس با ما</h1>
              <Form form={form} style={{ maxWidth: 600 }} onFinish={onFinish}>
                <Row gutter={[8, 0]} justify="center">
                  <Col md={24} xs={24}>
                    <Form.Item
                      name="subject"
                      rules={[
                        { message: "عنوان پیام الزامیست", required: true },
                      ]}
                    >
                      <Input placeholder="عنوان پیام" size="large" />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item name="name">
                      <Input placeholder="نام و نام خانوادگی" size="large" />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item name="email">
                      <Input placeholder="ایمیل" size="large" />
                    </Form.Item>
                  </Col>
                  <Col md={24} xs={24}>
                    <Form.Item
                      name="body"
                      rules={[{ message: "متن پیام الزامیست", required: true }]}
                    >
                      <TextArea rows={4} placeholder="متن پیام" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    ارسال پیام
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default memo(Contact);

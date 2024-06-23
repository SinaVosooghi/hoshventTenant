import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { setCookie } from "cookies-next";
import { Col, Row, Space } from "antd";
import Link from "next/link";
import useGetSetting from "../../hooks/useGetSetting";
// @ts-ignore
import { Slide } from "react-reveal";
import { useEffect } from "react";

require("./style.less");

const MainFooter = () => {
  const { data } = useGetSetting();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // @ts-ignore
    setCookie("currency", JSON.stringify(data?.currency));
  }, [data]);

  return (
    <footer id="main-footer">
      <Slide bottom>
        <Row justify="center">
          <Col md={20} xs={24}>
            <Row gutter={[100, 0]}>
              <Col md={24} xs={24}>
                <Row justify="space-between">
                  <Col md={8} xs={24}>
                    <div className="footer-logo">
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_SITE_URL + "/" + data?.logo
                        }`}
                        height={70}
                      />
                      <img
                        src="/assets/up.png"
                        width={40}
                        height={40}
                        onClick={() => scrollToTop()}
                      />
                    </div>
                  </Col>
                  <Col md={6} xs={24}>
                    <div className="footer-socials">
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
                  </Col>
                </Row>
                <Row gutter={[100, 36]} align="middle">
                  <Col md={9}>
                    <p className="footer-about">{data?.seodescription ?? ""}</p>
                    <Space direction="horizontal" size={36}>
                      {data?.phoneNumber && (
                        <div className="footer-button">
                          <img src="/assets/call.png" width={50} height={50} />
                          <div className="button-content">
                            شماره تماس <br />
                            <p>
                              <strong>{data?.phoneNumber}</strong> 021
                            </p>
                          </div>
                        </div>
                      )}
                      {data?.workinghours && (
                        <div className="footer-button">
                          <img src="/assets/time.png" width={50} height={50} />
                          <div className="button-content">
                            ساعات کاری
                            <br />
                            <p>
                              <strong>{data?.workinghours}</strong>
                            </p>
                          </div>
                        </div>
                      )}
                    </Space>
                  </Col>
                  <Col md={6} xs={24}>
                    <div id="footer-navigation">
                      <ul>
                        <li>
                          <Link href={"/events"}>رویداد ها</Link>
                        </li>
                        <li>
                          <Link href={"/seminars"}>سمینار ها</Link>
                        </li>
                        <li>
                          <Link href={"/workshops"}>ورکشاپ ها</Link>
                        </li>
                        <li>
                          <Link href={"/register"}>ثبت نام</Link>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <Link href={"/contact"}>تماس باما</Link>
                        </li>
                        <li>
                          <Link href={"/about"}> درباره ما </Link>
                        </li>
                        <li>
                          <Link href={"/login"}> ورود مراجعین </Link>
                        </li>
                        <li>
                          <Link href={"/login"}> پنل کاربری </Link>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={9} xs={24}></Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[100, 36]} align="middle">
              <Col md={8} xs={24}>
                {data?.address && (
                  <div className="footer-button address">
                    <img src="/assets/address.png" width={50} height={50} />
                    <div className="button-content">
                      آدرس <br />
                      <p>{data?.address}</p>
                    </div>
                  </div>
                )}
              </Col>
              <Col md={16} xs={24}>
                <span className="divider"></span>
                <div className="awards">
                  <a
                    referrerpolicy="origin"
                    target="_blank"
                    href="https://trustseal.enamad.ir/?id=460181&Code=dhZALgdBDDabU64P3rsRcSujOcg84lIT"
                  >
                    <img
                      referrerpolicy="origin"
                      src="https://trustseal.enamad.ir/logo.aspx?id=460181&Code=dhZALgdBDDabU64P3rsRcSujOcg84lIT"
                      alt=""
                      Code="dhZALgdBDDabU64P3rsRcSujOcg84lIT"
                    />
                  </a>
                </div>
              </Col>
            </Row>
            <Row align="middle" justify="space-around">
              <Col md={4} xs={12}>
                <Link href={"/about"}>قوانین و مقررات سایت </Link>
              </Col>
              <Col md={4} xs={12}>
                <Link href={"/contact"}> ثبت شکایت</Link>
              </Col>
              <Col md={8} xs={24}>
                <p>
                  کلیه حقوق این سایت متعلق به
                  <a href="#"> موسسه مطالعات جامع رستا </a> می باشد
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Slide>
    </footer>
  );
};

export default MainFooter;

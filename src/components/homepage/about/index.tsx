import { Button, Col, Row, Space } from "antd";
import Image from "next/dist/client/image";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import parse from "html-react-parser";
import useGetSetting from "../../../hooks/useGetSetting";
import Link from "next/link";

require("./style.less");
const HomeAbout = () => {
  const { data } = useGetSetting();
  return (
    <div id="home-about">
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row className="about-container">
            <Col md={12}>
              <div className="about-content">
                <div className="about-title">
                  <h1>
                    معرفی <strong> رویداد</strong>
                  </h1>
                </div>
                {data?.body && parse(data?.body)}

                <Space align="center" className="about-meta">
                  <Link href="/about">
                    <Button type="primary" size="large" className="about-button">
                      بیشتر بدانید
                      <Image
                        src="/assets/icons/arrow-left.png"
                        height={12}
                        width={18}
                        alt="arrow"
                      />
                    </Button>
                  </Link>
                  <span className="shop-link">خدمات {data?.title}</span>
                </Space>
              </div>
            </Col>
            <Col md={12}>
              <div className="about-image">
                <Fade>
                  <img
                    src="/assets/about/video-thumbnail.png"
                    alt="event"
                    className="video"
                  />
                </Fade>
                <Fade>
                  <img
                    src="/assets/button-pattern.png"
                    alt="event"
                    className="video-dots"
                  />
                </Fade>
                <Fade>
                  <img
                    src="/assets/about/circles.png"
                    alt="event"
                    className="circles"
                  />
                </Fade>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomeAbout;

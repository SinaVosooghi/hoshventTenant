import { Button, Col, Row, Space } from "antd";
import Image from "next/dist/client/image";
// @ts-ignore
import { Fade, Slide } from "react-reveal";

require("./style.less");
const HomeAbout = () => {
  return (
    <div id="home-about">
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row className="about-container">
            <Col md={12}>
              <div className="about-content">
                <div className="about-title">
                  <h1>
                    معرفی <strong> محصول</strong>
                  </h1>
                </div>
                <ul>
                  <li> سامانه نرم افزاری مدیریت الکترونیک مبتنی بر بارکد و</li>
                  <li> راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک</li>
                  <li> سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)</li>
                  <li> سامانه برگزاری انتخابات انجمن‌ها و سازمان‌ها</li>
                  <li>
                    سیستم مدیریت متمرکز ارئه سخنرانی‌های در محل رویداد (چک
                    اسلاید)
                  </li>
                  <li>
                    ضبط نرم افزاری سخنرانی و تهیه لوح فشرده کل سخنرانی‌های
                    رویداد
                  </li>
                </ul>
                <Space align="center" className="about-meta">
                  <Button type="primary" size="large" className="about-button">
                    شروع کنید
                    <Image
                      src="/assets/icons/arrow-left.png"
                      height={12}
                      width={18}
                      alt="arrow"
                    />
                  </Button>
                  <span className="shop-link">خدمات رستا</span>
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

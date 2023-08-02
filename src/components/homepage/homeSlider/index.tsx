/* eslint-disable @next/next/no-img-element */
import { Button, Col, Row, Space } from "antd";
import Link from "next/link";
// @ts-ignore
import { Fade, Slide } from "react-reveal";

require("./style.less");

const HomeMainSlider = () => {
  return (
    <div id="main-slider">
      <Row justify="center">
        <Col md={20} xs={21}>
          <Row className="slider-main-content">
            <Col md={7} className="slider-content">
              <Fade>
                <h1>
                  سامانه داوری
                  <br />
                  <strong> همــایش </strong>
                </h1>
                <p>رستـــــا : برگزار کننده هوشمنـــد رویداد ها</p>
              </Fade>
              <div className="slider-meta">
                <Link href="/courses">
                  <Fade>
                    <div className="slider-action  hidden-xs">
                      <Fade>
                        <div className="slider-action-btn">
                          <img
                            src="/assets/icons/check.png"
                            alt="slide"
                            className="clock"
                            width={220}
                          />
                          <div>
                            <span>2550</span>
                            همایش اجرا شده{" "}
                          </div>
                          <img
                            src="/assets/icons/arrow.png"
                            className="button-icon"
                            alt="slide"
                          />
                        </div>
                      </Fade>
                    </div>
                  </Fade>
                </Link>
              </div>
            </Col>
            <Col md={10} className=" hidden-xs">
              <div className="slider-image">
                <Fade>
                  <img src="/assets/slides/man.png" alt="arrow" />
                </Fade>
                <Fade>
                  <img
                    src="/assets/slides/circle-1.png"
                    alt="slide"
                    className="circle-1"
                  />
                </Fade>
                <Fade>
                  <img
                    src="/assets/slides/circle-2.png"
                    alt="slide"
                    className="circle-2"
                  />
                </Fade>
              </div>
            </Col>
            <Col md={7} className="slide-text">
              <p>
                موسســــه مطالعات جامع رستــــــــا مجــــــری و برگزار کننـــده
                هوشمند رویدادها، سمینار‌‌ها و ارائه دهنده خدمات تشــــــریفات و
                دوره‌هـــــای آمــــوزشی حرفه ای با بهره‌منــدی از تیمی خلاق و
                متخصص است
              </p>
              <a>
                شروع کنید
                <img
                  src="/assets/icons/orange-arrow.png"
                  alt="slide"
                  className="clock"
                />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomeMainSlider;

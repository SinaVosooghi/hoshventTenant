import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CategoriesSlider from "../../src/components/categoriesSlider";
import { NextSeo } from "next-seo";
import useGetSetting from "../../src/hooks/useGetSetting";
import parse from "html-react-parser";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import Link from "next/link";

require("./style.less");

const About = () => {
  const { data } = useGetSetting();

  return (
    <>
      <NextSeo title="درباره ما" description={"درباره ما"} />
      <div id="about">
        <MainBreadCrumb activeItem="درباره ما" />
        <Row justify="center">
          <Col md={20} xs={24} id="teacher-container">
            <Row
              className="slider-main-content"
              justify="center"
              align="middle"
            >
              <Col md={12} className="slider-content">
                <Fade>
                  <div className="slider-action hidden-xs">
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
                  </div>
                </Fade>
                <img src="/assets/about/about-image.png" alt="slide" />
              </Col>
              <Col md={8}>
                <Fade>
                  <div className="about-title">
                    <h1>
                      موسسه <strong>رستا</strong>
                    </h1>
                    <p>
                      مجری و برگزار کننده هوشمند رویدادها، سمینار‌‌ها و ارائه
                      دهنده خدمات تشریفات و دوره‌های آموزشی حرفه ای
                    </p>
                    <small>موسسه مطالعات جامع</small>
                  </div>
                </Fade>
              </Col>
            </Row>

            <Row className="about-main-content" justify="center" align="middle">
              <Col md={8} className="about-image">
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
                <h3>درباره ما</h3>
                <img src="/assets/about/about-logo.png" alt="arrow" />
              </Col>
              <Col md={16}>
                <Slide bottom>
                  <div className="about-content">
                    {data?.description && parse(data?.description)}
                  </div>
                </Slide>
              </Col>
            </Row>
          </Col>
        </Row>
        <CategoriesSlider />
        <div className="pattern">
          <img src="/assets/slides/slider-pattern.png" alt="slide" />
        </div>
      </div>
    </>
  );
};

export default About;

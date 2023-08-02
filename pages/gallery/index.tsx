import { useQuery } from "@apollo/client";
import { Col, Row, Image as AntImage } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";
import { siteGetSliders } from "../../src/shared/apollo/graphql/queries/slider/siteGetSliders";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import Slider from "../../src/datamodel/Slider";
import Image from "next/image";

require("./style.less");

const Plans = ({}) => {
  const { data: sliders, loading: SlidersLoading } = useQuery(siteGetSliders, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 40,
        skip: 0,
        status: true,
      },
    },
  });

  const params = {
    autoplay: {
      delay: 5500,
    },
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };
  return (
    <>
      <NextSeo title={"نسخه ها و قیمت ها"} description={"نسخه ها و قیمت ها"} />
      <div id="gallery">
        <MainBreadCrumb activeItem="نسخه ها و قیمت ها" />

        <Row justify="center">
          <Col md={20} xs={24}>
            <div className="page-title">
              <Fade>
                <img
                  src="/assets/page-title.png"
                  alt="نسخه ها و قیمت ها"
                  className="page-title-icon"
                />
                <h1>
                  گالری <br />
                  <strong>تصاویر</strong>
                </h1>
              </Fade>
            </div>
          </Col>
          <Col md={20} xs={24} id="gallery-container">
            <Fade>
              <div id="gallery-card">
                <Row>
                  <Col md={24} xs={24} className="gallery-content">
                    <div className="gallery">
                      {sliders?.slidersApi?.sliders.length ? (
                        <Col md={24} xs={24} id="shop-container">
                          <div className="shop-slider">
                            <Swiper
                              className="shop-main-swiper"
                              {...params}
                              navigation={true}
                              modules={[Autoplay, Navigation]}
                            >
                              {sliders?.slidersApi?.sliders
                                ?.filter((s: any) => s.featured)
                                .map((slider: Slider) => (
                                  <SwiperSlide key={slider.id}>
                                    <div className="shop-slider-item">
                                      <Image
                                        src={
                                          process.env.NEXT_PUBLIC_SITE_URL +
                                          "/" +
                                          slider.image
                                        }
                                        alt={slider.alt}
                                        sizes="100vw"
                                        fill
                                      />
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </div>
                        </Col>
                      ) : (
                        <></>
                      )}

                      <Row
                        className="gallery-items"
                        align="middle"
                        justify="center"
                        gutter={[16, 16]}
                      >
                        {sliders?.slidersApi?.sliders
                          ?.filter((s: any) => !s.featured)
                          .map((slider: Slider) => (
                            <Col
                              className="gallery-item"
                              md={8}
                              key={slider.id}
                            >
                              <AntImage
                                src={
                                  process.env.NEXT_PUBLIC_SITE_URL +
                                  "/" +
                                  slider.image
                                }
                                alt={slider.alt}
                                sizes="100vw"
                              />
                            </Col>
                          ))}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Plans;

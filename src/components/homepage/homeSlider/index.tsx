/* eslint-disable @next/next/no-img-element */
import { Button, Col, Row, Space } from "antd";
import Link from "next/link";
// @ts-ignore
import { Fade, Slide } from "react-reveal";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { siteGetSliders } from "../../../shared/apollo/graphql/queries/slider/siteGetSliders";
import { useQuery } from "@apollo/client";
import parse from "html-react-parser";

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

require("./style.less");

const HomeMainSlider = () => {
  const { data: sliders } = useQuery(siteGetSliders, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 6,
        skip: 0,
        status: true,
        // @ts-ignore
        site: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });
  return (
    <div id="main-slider">
      <Row justify="center">
        <Col md={20} xs={21}>
          <div className="blogs-slider">
            <Swiper
              className="blogs-main-swiper"
              {...params}
              navigation={true}
              modules={[Autoplay, Navigation]}
            >
              {sliders?.slidersApi?.sliders.map((slide: any) => (
                <SwiperSlide key={slide.id}>
                  <Link href={slide.link}>
                    <div
                      className="blogs-slider-item"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL + "/" + slide.image
                        }')`,
                      }}
                    >
                      <div className="blogs-slider-content">
                        {slide.body && parse(slide.body)}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomeMainSlider;

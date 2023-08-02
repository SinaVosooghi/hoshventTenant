import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row, Space } from "antd";
import FeaturedItem from "./featuredItem";
import Link from "next/link";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import Event from "../../../datamodel/Event";
require("./style.less");

const EventSlider = ({
  items,
  loading,
  title,
  subTitle,
  type,
  hideShowMore,
}: {
  items: [Event];
  loading?: boolean;
  title: string;
  subTitle: string;
  type?: "blue" | "orange";
  hideShowMore?: boolean;
}) => {
  const params = {
    autoplay: {
      delay: 3500,
    },
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 8,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 60,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4.19,
        spaceBetween: 30,
      },
    },
  };

  return (
    <div id="featured-courses" className={`section featured ${type}`}>
      <img className="arrow" src="/assets/featured/arrow.png" alt="rasta" />
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row justify="space-between" align="middle">
            <Col md={8}>
              <div className="section-title">
                <h2>
                  {title}
                  <br /> <strong>{subTitle}</strong>
                </h2>
              </div>
            </Col>
            <Col md={8} className="section-actions">
              {!hideShowMore ? (
                <div className="actions-btn">
                  <Button>مشاهده همه </Button>
                  <span className="actions-icon">
                    <img
                      src="/assets/icons/arrow-left.png"
                      height={12}
                      width={18}
                      alt="arrow"
                    />
                  </span>
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col md={20} xs={24}>
          <div className="swiper-container">
            <Fade>
              <Swiper
                className="main-swiper"
                {...params}
                navigation={true}
                modules={[Autoplay, Navigation]}
              >
                {items?.map((event: Event) => (
                  <SwiperSlide key={event?.id}>
                    <Link href={`/event/${event?.slug}`}>
                      <FeaturedItem event={event} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Fade>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EventSlider;

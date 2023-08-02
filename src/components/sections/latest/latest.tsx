import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import LatestItem from "./latestItem";
import Course from "../../../datamodel/Course";
import Link from "next/link";
// @ts-ignore
import { Fade } from "react-reveal";
import TransitionGroup from "react-transition-group/TransitionGroup";

require("./style.less");

const LatestWorkShops = ({
  items,
  loading,
  title,
  subTitle,
  type,
}: {
  items: [Course];
  loading?: boolean;
  title: string;
  subTitle: string;
  type?: "blue" | "orange";
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
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4.09,
        spaceBetween: 30,
      },
    },
  };

  return (
    <div id="latest-courses" className={`section ${type}`}>
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row justify="space-between" align="middle">
            <Col md={8}>
              <div className="section-title">
                <span className="icon-btn">
                  <CheckOutlined />
                </span>
                <h2>
                  {title}
                  <br /> <strong>{subTitle}</strong>
                </h2>
              </div>
            </Col>
            <Col md={8} className="section-actions">
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
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="swiper-container">
        <TransitionGroup>
          <Swiper
            className="main-swiper"
            {...params}
            navigation={true}
            modules={[Autoplay, Navigation]}
          >
            {items?.map((item) => (
              <Fade key={item.id}>
                <SwiperSlide>
                  <Link href={`/course/${item.slug}`}>
                    <LatestItem course={item} />
                  </Link>
                </SwiperSlide>
              </Fade>
            ))}
          </Swiper>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default LatestWorkShops;

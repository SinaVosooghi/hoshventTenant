import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row, Space } from "antd";
import Link from "next/link";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import Plan from "../../datamodel/Plan";
import { useQuery } from "@apollo/client";
import { siteGetPlans } from "../../shared/apollo/graphql/queries/plans/siteGetPlans";
import { siteGetServices } from "../../shared/apollo/graphql/queries/services/siteGetServices";
import Service from "../../datamodel/Service";
import Workshop from "../../datamodel/Workshop";
import WorkshopItem from "../plans/workshopItem";
import WorkshopSliderItem from "./workshopItem";
require("./style.less");

const WorkshopSlider = ({
  loading,
  title,
  subTitle,
  type,
  hideShowMore,
  seminars,
}: {
  loading?: boolean;
  title: string;
  subTitle: string;
  type?: "blue" | "orange";
  hideShowMore?: boolean;
  seminars: [any];
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
    <div id="workshop-plans" className={`section featured ${type}`}>
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
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col md={20} xs={24}>
          <div className="swiper-container">
            <Fade>
              <Row gutter={[24, 24]}>
                {seminars?.map((hall: Workshop) => {
                  return hall.workshops?.map((workshop) => (
                    <Col md={6} xs={12} key={workshop.id}>
                      <WorkshopSliderItem workshop={workshop} />
                    </Col>
                  ));
                })}
              </Row>
            </Fade>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WorkshopSlider;

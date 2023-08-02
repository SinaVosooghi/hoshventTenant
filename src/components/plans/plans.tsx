import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row, Space } from "antd";
import FeaturedItem from "./planItem";
import Link from "next/link";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import Plan from "../../datamodel/Plan";
import PlanItem from "./planItem";
import { useQuery } from "@apollo/client";
import { siteGetPlans } from "../../shared/apollo/graphql/queries/plans/siteGetPlans";
require("./style.less");

const 
PlanSlider = ({
  loading,
  title,
  subTitle,
  type,
  hideShowMore,
}: {
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

  const { data: plans } = useQuery(siteGetPlans, {
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        limit: 6,
        skip: 0,
        status: true,
      },
    },
  });

  return (
    <div id="featured-plans" className={`section featured ${type}`}>
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
                {plans?.plansApi?.plans?.map((plan: Plan) => (
                  <SwiperSlide key={plan?.id}>
                    <Link href={`/plan/${plan?.slug}`}>
                      <PlanItem plan={plan} />
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

export default PlanSlider;

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import ProductItem from "./productItem";
import Link from "next/link";
import Product from "../../../datamodel/Product";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import TransitionGroup from "react-transition-group/TransitionGroup";

require("./style.less");

const LatestProducts = ({
  items,
  loading,
  title,
  subTitle,
  type,
}: {
  items: [Product];
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
        slidesPerView: 1.25,
        spaceBetween: 8,
      },
      480: {
        slidesPerView: 1.15,
        spaceBetween: 60,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
    },
  };

  return (
    <div id="latest-products" className={`section products ${type}`}>
      <Fade>
        <Row justify="center">
          <Col md={20} xs={24}>
            <Row justify="space-between" align="middle">
              <Col md={8}>
                <div className="section-title">
                  <span className="icon-btn">
                    <ShoppingOutlined />
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
            <Row>
              <Col md={24}>
                <div className="swiper-container shop">
                  <TransitionGroup>
                    <Swiper
                      className="main-swiper"
                      {...params}
                      navigation={true}
                      modules={[Autoplay, Navigation]}
                    >
                      {items?.map((item) => (
                        <SwiperSlide key={item.id}>
                          <Link href={`/product/${item.slug}`}>
                            <ProductItem product={item} />
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </TransitionGroup>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fade>
    </div>
  );
};

export default LatestProducts;

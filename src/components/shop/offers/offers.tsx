import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Button, Col, Row } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { siteGetCoursesApi } from "../../../shared/apollo/graphql/queries/event/siteGetEventsApi";
import ProductItem from "../../sections/products/productItem";
import Link from "next/link";
import Course from "../../../datamodel/Course";

require("./style.less");

const ProductsOffers = () => {
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
        slidesPerView: 3.09,
        spaceBetween: 60,
      },
      1024: {
        slidesPerView: 4.09,
        spaceBetween: 60,
      },
    },
  };

  const { data: coursesApi, loading } = useQuery(siteGetCoursesApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 7,
        skip: 0,
        featured: true,
      },
    },
  });

  return (
    <div id="featured-products" className="section featured">
      <img className="arrow" src="/assets/featured/arrow.png" alt="rasta" />
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row justify="space-between" align="middle">
            <Col md={8}>
              <div className="section-title">
                <span className="icon-btn">
                  <CheckOutlined />
                </span>
                <h2>
                  دوره های <br /> <strong>ویـژه</strong>
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
      <Row className="swiper-container" justify="center">
        <Col md={20} xs={24} className="swiper-container shop">
          <Swiper
            className="main-swiper"
            {...params}
            navigation={true}
            modules={[Autoplay, Navigation]}
          >
            {/* {coursesApi?.coursesApi?.courses?.map((item: Course) => (
              <SwiperSlide key={1}>
                <Link href={"/product"}>
                  <ProductItem product={item} />
                </Link>
              </SwiperSlide>
            ))} */}
          </Swiper>
        </Col>
      </Row>
    </div>
  );
};

export default ProductsOffers;

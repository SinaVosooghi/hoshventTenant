import { Col, Row } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import Image from "next/dist/client/image";
import { useQuery } from "@apollo/client";
import { siteGetCategories } from "../../shared/apollo/graphql/queries/category/siteGetCategories";
import Category from "../../datamodel/Category";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import { siteGetBrands } from "../../shared/apollo/graphql/queries/brand/siteGetBrands";

require("./style.less");

const CategoriesSlider = () => {
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
        slidesPerView: 4,
        spaceBetween: 0,
      },
      1024: {
        slidesPerView: 7,
        spaceBetween: 0,
      },
    },
  };

  const { data: brands, loading } = useQuery(siteGetBrands, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 14,
        skip: 0,
        featured: true,
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

  return (
    <div id="category-slider">
      <p>برخی از مشتریان</p>
      <Fade>
        <Row justify="center">
          <Col md={20} xs={24}>
            <div className="categories-swiper">
              <Swiper
                className="main-swiper"
                {...params}
                navigation={true}
                modules={[Autoplay, Navigation]}
              >
                {brands?.brandsApi?.brands.map((brand: Category) => (
                  <SwiperSlide key={brand.id}>
                    <div className="category-item">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_SITE_URL + "/" + brand.image
                        }
                        width={100}
                        alt={brand.title}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>
        </Row>
      </Fade>
    </div>
  );
};

export default CategoriesSlider;

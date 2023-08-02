import { Col, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import Image from "next/image";
import CategoriesSlider from "../../src/components/categoriesSlider";
import LatestProducts from "../../src/components/sections/products/products";
import { useQuery } from "@apollo/client";
import { siteGetProductsApi } from "../../src/shared/apollo/graphql/queries/product/siteGetProductsApi";
import { siteGetSliders } from "../../src/shared/apollo/graphql/queries/slider/siteGetSliders";
import Slider from "../../src/datamodel/Slider";
import { NextSeo } from "next-seo";
import { memo } from "react";
require("./style.less");

const Shop = () => {
  const { data: productsApi, loading: ProductsLoading } = useQuery(
    siteGetProductsApi,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        input: {
          limit: 9,
          skip: 0,
        },
      },
    }
  );

  const { data: sliders, loading: SlidersLoading } = useQuery(siteGetSliders, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 9,
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
      <NextSeo
        title={"فروشگاه سامانه داوری "}
        description={"فروشگاه سامانه داوری "}
      />
      <div id="shop">
        <MainBreadCrumb activeItem="فروشگاه" />
        <Row justify="center">
          {sliders?.slidersApi?.sliders.length ? (
            <Col md={20} xs={24} id="shop-container">
              <div className="shop-slider">
                <Swiper
                  className="shop-main-swiper"
                  {...params}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                >
                  {sliders?.slidersApi?.sliders?.map((slider: Slider) => (
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

          <LatestProducts
            items={productsApi?.productsApi?.products}
            loading={ProductsLoading}
            title="جدیدترین محصولات"
            subTitle="فروشگاه"
          />

          <Col md={20} xs={24} id="ads-banners">
            <Row justify="space-between" align="middle">
              <Col>
                <Image
                  src={"/assets/shop/banner-2.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>

              <Col>
                <Image
                  src={"/assets/shop/banner-3.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>
              <Col>
                <Image
                  src={"/assets/shop/banner-1.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>
            </Row>
          </Col>

          <LatestProducts
            items={productsApi?.productsApi?.products}
            loading={ProductsLoading}
            title="جدیدترین محصولات"
            subTitle="فروشگاه"
          />

          <Col md={20} xs={24} id="ads-banners">
            <Row justify="space-between" align="middle">
              <Col>
                <Image
                  src={"/assets/shop/banner-2.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>

              <Col>
                <Image
                  src={"/assets/shop/banner-3.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>
              <Col>
                <Image
                  src={"/assets/shop/banner-1.png"}
                  alt={""}
                  sizes="100vw"
                  height={170}
                  width={366}
                />
              </Col>
            </Row>
          </Col>

          <LatestProducts
            items={productsApi?.productsApi?.products}
            loading={ProductsLoading}
            title="جدیدترین محصولات"
            subTitle="فروشگاه"
          />

          <CategoriesSlider />
        </Row>
      </div>
    </>
  );
};

export default memo(Shop);

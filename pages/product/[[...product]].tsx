import { EditFilled, StarFilled } from "@ant-design/icons";
import { Button, Col, message, notification, Row, Space } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CategoriesSlider from "../../src/components/categoriesSlider";
import { siteGetProductApi } from "../../src/shared/apollo/graphql/queries/product/siteGetProductApi";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import { NextSeo } from "next-seo";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../src/shared/store";
import { useState } from "react";
// @ts-ignore
import { Fade } from "react-reveal";
import VariationType from "../../src/datamodel/Variation";
import Link from "next/link";
import currencyType from "../../src/components/currency";

require("./style.less");

const Product = () => {
  const router = useRouter();
  const { product } = router.query;
  const dispatch = useDispatch<Dispatch>();
  const [selectedImage, setSelectedImage] = useState("");

  const { data, loading } = useQuery(siteGetProductApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: product && product[0] },
    onCompleted: (data) => {
      setSelectedImage(data?.productApi.image[0]);
    },
  });

  const addToCart = () => {
    notification.success({
      message: `محصول اضافه شد`,
      description: (
        <>محصول {data?.productApi?.title} به سبد خرید شما اضافه شد.</>
      ),
    });
    dispatch.cart.addItem(data?.productApi);
  };

  return (
    <>
      <NextSeo
        title={data?.productApi?.title}
        description={data?.productApi?.seobody}
      />
      <div id="product">
        <MainBreadCrumb
          secondItem="فروشگاه"
          activeItem={data?.productApi?.title}
        />

        <Fade>
          <Row justify="center" gutter={[20, 20]}>
            <Col md={20} xs={24} id="product-container">
              <div className="product-content">
                <Row gutter={[48, 48]}>
                  <Col md={11} xs={24}>
                    <div className="product-image-box">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_SITE_URL + "/" + selectedImage
                        }
                        width={300}
                        alt="rasta"
                      />
                      <div className="product-thumbnails">
                        {data?.productApi?.image?.map(
                          (image: string, index: number) => (
                            <img
                              key={index}
                              src={
                                process.env.NEXT_PUBLIC_SITE_URL + "/" + image
                              }
                              alt="rasta"
                              width={130}
                              onClick={() => {
                                setSelectedImage(image);
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={13} xs={24}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <h1>{data?.productApi?.title}</h1>
                      <div className="product-info">
                        <div className="rating">
                          <StarFilled />
                          4.9
                        </div>
                        <div className="product-info-item">
                          دسته بندی
                          <span>{data?.productApi?.category?.title}</span>
                        </div>
                        <div className="product-info-item">
                          تامین کالا از
                          <span> ۱۰ روز کاری آینده</span>
                        </div>
                        <div className="product-info-item stock">
                          وضعیت
                          <span>
                            {data?.productApi?.quantity > 0
                              ? "موجود در انبار "
                              : "نا موجود"}
                          </span>
                        </div>
                      </div>
                      <div className="product-description">
                        {data?.productApi?.variations && (
                          <>
                            <p className="product-description-title">
                              ویژگی های محصول
                            </p>

                            <ul>
                              {data?.productApi?.variations.map(
                                (variation: VariationType, index: number) => (
                                  <li key={index}>
                                    <strong>{variation.variation.title}</strong>
                                    : {variation.value}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                      </div>
                      <div className="product-price">
                        <p className="sale">
                          {data?.productApi?.offprice?.toLocaleString()}
                        </p>
                        <p className="price">
                          {data?.productApi?.price?.toLocaleString()}
                        </p>
                        <span>
                          {data?.productApi?.price
                            ? currencyType()
                            : "بدون قیمت"}
                        </span>
                      </div>
                      <Button block onClick={() => addToCart()}>
                        افزودن به سبد خرید
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Col>
            {data?.productApi?.body && (
              <Col md={20} xs={24}>
                <div className="product-description">
                  <div className="description-title">
                    <div className="icon">
                      <EditFilled />
                    </div>
                    <div>
                      <p>نقد و بررسی</p>
                      اجمالی
                    </div>
                  </div>
                  <div className="desc">
                    <div className="pattern">
                      <img src="/assets/shop/pattern.png" alt="slide" />
                    </div>
                    <div>
                      {data?.productApi?.body && parse(data?.productApi?.body)}
                    </div>
                  </div>
                </div>
              </Col>
            )}

            {/* <ProductsOffers /> */}
          </Row>
        </Fade>
        <CategoriesSlider />
      </div>
    </>
  );
};

export default Product;

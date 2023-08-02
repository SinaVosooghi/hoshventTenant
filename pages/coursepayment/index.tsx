import { useState } from "react";
import { Button, Col, Empty, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../src/shared/store";
import { NextSeo } from "next-seo";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../src/hooks/paymentForm";
import Setting from "../../src/datamodel/Setting";
import useGetSetting from "../../src/hooks/useGetSetting";
import { renderCurrency } from "../../src/util/utils";
import { CloseOutlined } from "@ant-design/icons";

require("./style.less");
const stripePromise = loadStripe(
  //@ts-ignore
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CourseCheckout = () => {
  const dispatch = useDispatch<Dispatch>();
  const { discount } = useSelector((state: RootState) => state.cart);

  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseCheckoutModel
  );

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data }: { data: Setting } = useGetSetting();

  const renderPrice = () => {
    const selectedDiscount = discount;
    let price = selectedCourse?.price ?? 0;
    const withTax = Math.round(data?.tax * price) / 100 + price;

    const discountWithTax = Math.round(
      // @ts-ignore
      (withTax * discount?.percent) / 100
    ).toLocaleString();

    if (
      selectedDiscount &&
      selectedDiscount.id &&
      selectedDiscount?.percent > 0
    ) {
      const discountPrice =
        // @ts-ignore
        (withTax * selectedDiscount.percent) / 100;
      // @ts-ignore
      price = withTax - discountPrice;
    } else {
      price = withTax;
    }

    if (!data?.tax) {
      return (
        <>
          {price.toLocaleString()}{" "}
          <small>{renderCurrency(data?.currency)} </small>
        </>
      );
    } else {
      return (
        <div className="invoice">
          <table className="highlight">
            <thead>
              <tr>
                <th className="right-align">ردیف</th>
                <th className="right-align">عنوان</th>
                <th className="left-align">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width={"10%"}>1</td>
                <td width={"80%"}>{selectedCourse?.title}</td>
                <td width={"5%"} className="left-align">
                  <div className="currency-text">
                    {selectedCourse?.price.toLocaleString()}
                    <small>{renderCurrency(data?.currency)} </small>
                  </div>
                </td>
              </tr>

              <tr>
                <td></td>
                <td className="right-align">مالیات</td>
                <td className="left-align">
                  {selectedCourse && (
                    <div className="currency-text">
                      {(
                        Math.round(data?.tax * selectedCourse?.price) / 100
                      ).toLocaleString()}
                      <small>{renderCurrency(data?.currency)} </small>
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td></td>
                <td className="right-align bold">مجموع</td>
                <td className="left-align bold">
                  {selectedCourse && (
                    <div className="currency-text">
                      {withTax.toLocaleString()}
                      <small>{renderCurrency(data?.currency)} </small>
                    </div>
                  )}
                </td>
              </tr>

              {discount && (
                <tr>
                  <td></td>
                  <td className="right-align">تخفیف</td>
                  <td className="left-align">
                    {selectedCourse && (
                      <div className="currency-text">
                        {discountWithTax}
                        <small>{renderCurrency(data?.currency)} -</small>
                      </div>
                    )}
                  </td>
                </tr>
              )}

              <tr>
                <td></td>
                <td className="right-align bold">قابل پردخت</td>
                <td
                  className="left-align bold"
                  style={{
                    backgroundColor: "#fff",
                    padding: "2px 10px",
                    borderRadius: 4,
                  }}
                >
                  {selectedCourse ? (
                    <div className="currency-text">
                      {price.toLocaleString()}
                      <small>{renderCurrency(data?.currency)} </small>
                    </div>
                  ) : (
                    <>بدون قیمت</>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  const removeCode = () => {
    dispatch.cart.removeDiscount();
  };

  return (
    <>
      <NextSeo title={`خرید دوره ${selectedCourse?.title}`} />
      <div id="buy-course">
        <MainBreadCrumb activeItem="ثبت نام در دوره" />
        {!selectedCourse ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ margin: 30 }}
            style={{ margin: 100 }}
            description={<span>سبد خرید خالیست</span>}
          >
            <Button onClick={() => router.push("/courses")}>
              مشاهده دوره ها
            </Button>
          </Empty>
        ) : (
          <Row justify="center">
            <Col md={9} xs={24} id="buy-course-container">
              <Row gutter={[36, 36]}>
                <Col md={24} xs={24}>
                  <div className="course-content-info">
                    <div className="course-content-title">
                      <img src="/assets/course/user.png" alt="slide" />
                      <div className="text-content">
                        <h1> اطلاعات پرداخت دوره</h1>
                        <p>
                          کالاهای موجود در سبد شما ثبت و رزرو نشده‌اند، برای ثبت
                          سفارش مراحل بعدی را تکمیل کنید
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                {discount && (
                  <Col md={24}>
                    <div className="discount-container">
                      <div>
                        <h2>کد تخفیف</h2>
                        <h3>
                          {discount.title} ({discount.percent}%)
                        </h3>
                      </div>
                      <CloseOutlined onClick={removeCode} rev={undefined} />
                    </div>
                  </Col>
                )}

                <Col md={24} xs={24}>
                  <div className="course-price-container">
                    <div className="course-total-price stripe">
                      <span>پرداخت</span>
                      <div className="course-price-card">
                        {selectedCourse?.price ? (
                          <>{renderPrice()}</>
                        ) : (
                          "رایگان"
                        )}{" "}
                      </div>
                    </div>

                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        setLoading={setLoading}
                        loading={loading}
                        courseId={selectedCourse?.id}
                        type="course"
                        total={
                          Math.round(data?.tax * selectedCourse?.price) / 100 +
                          selectedCourse?.price
                        }
                      />
                    </Elements>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default CourseCheckout;

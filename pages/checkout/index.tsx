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
import Product from "../../src/datamodel/Product";
import Event from "../../src/datamodel/Event";
import usePayment from "../../src/hooks/usePayment";

require("./style.less");

const CourseCheckout = () => {
  const { items, discount } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data }: { data: Setting } = useGetSetting();

  const total = () => {
    let total = 0;
    total = Math.ceil(
      items
        ?.map((item: any) => {
          const servicesTotal = item.services?.reduce(
            (prev: any, curr: any) => prev + curr.price,
            0
          );
          return (item?.price + servicesTotal) * item?.qty;
        })
        .reduce((prev: any, curr: any) => prev + curr, 0)
    );

    return total;
  };

  const renderEventPrice = (item) => {
    const servicesTotal = item.services?.reduce(
      (prev: any, curr: any) => prev + curr.price,
      0
    );
    return item?.price + servicesTotal;
  };

  const renderPrice = () => {
    const selectedDiscount = discount;
    let price = total() ?? 0;

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
          {total().toLocaleString()}{" "}
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
                <th className="right-align">تعداد</th>
                <th className="left-align">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((event: Event) => {
                return (
                  <tr key={event.id}>
                    <td width={"10%"}>1</td>
                    <td width={"50%"}>{event?.title}</td>
                    <td width={"10%"}>{event?.qty}</td>
                    <td width={"10%"} className="left-align">
                      <div className="currency-text">
                        {renderEventPrice(event).toLocaleString()}
                        <small>{renderCurrency(data?.currency)} </small>
                      </div>
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td></td>
                <td></td>
                <td className="right-align">
                  مالیات{`${data.tax && " (" + data.tax + "%)"}`}
                </td>
                <td className="left-align">
                  {items && (
                    <div className="currency-text">
                      {(Math.round(data?.tax * total()) / 100).toLocaleString()}
                      <small>{renderCurrency(data?.currency)} </small>
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td className="right-align bold">مجموع</td>
                <td className="left-align bold">
                  <div className="currency-text">
                    {withTax.toLocaleString()}
                    <small>{renderCurrency(data?.currency)} </small>
                  </div>
                </td>
              </tr>

              {discount && (
                <tr>
                  <td></td>
                  <td></td>
                  <td className="right-align">تخفیف</td>
                  <td className="left-align">
                    <div className="currency-text">
                      {discountWithTax}
                      <small>{renderCurrency(data?.currency)} -</small>
                    </div>
                  </td>
                </tr>
              )}

              <tr>
                <td></td>
                <td></td>
                <td className="right-align bold">قابل پردخت</td>
                <td className="left-align bold">
                  {total() ? (
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

  return (
    <>
      <NextSeo title={`پرداخت`} />
      <div id="buy-course">
        <MainBreadCrumb activeItem="ثبت نام در رویداد" />
        {!items ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ margin: 30 }}
            style={{ margin: 100 }}
            description={<span>سبد خرید خالیست</span>}
          >
            <Button onClick={() => router.push("/courses")}>
              مشاهده رویداد ها
            </Button>
          </Empty>
        ) : (
          <Row justify="center" gutter={[36, 36]}>
            <Col md={10} id="buy-course-container">
              <Row gutter={[36, 36]}>
                <Col md={24}>
                  <div className="course-content-info">
                    <div className="course-content-title">
                      <img src="/assets/course/user.png" alt="slide" />
                      <div className="text-content">
                        <h1> اطلاعات پرداخت</h1>
                        <p>
                          کالاهای موجود در سبد شما ثبت و رزرو نشده‌اند، برای ثبت
                          سفارش مراحل بعدی را تکمیل کنید
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={24}>
                  <div className="course-price-container">
                    <div className="course-total-price stripe">
                      <span>پرداخت</span>
                      <div className="course-price-card">
                        {items ? <>{renderPrice()}</> : "رایگان"}{" "}
                      </div>
                    </div>
                    <PaymentForm
                      setLoading={setLoading}
                      loading={loading}
                      items={items}
                      total={Math.round(data?.tax * total()) / 100 + total()}
                      type="event"
                    />
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

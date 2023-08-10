import { Button, Col, Empty, notification, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CourseCheckoutInfo from "./components/courseInfo";
import DiscountInput from "./components/discountInput";
import { useRouter } from "next/dist/client/router";
import { useSelector } from "react-redux";
import { RootState } from "../../src/shared/store";
import { NextSeo } from "next-seo";
import currencyType from "../../src/components/currency";

require("./style.less");

const CourseCheckout = () => {
  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseCheckoutModel
  );
  const { discount } = useSelector((state: RootState) => state.cart);

  const router = useRouter();

  const buyCourse = () => {
    router.push("/coursepayment");
  };

  const renderPrice = () => {
    const selectedDiscount = discount;
    let price = selectedCourse?.price;

    return price ? (
      <div className="price-container">
        {discount && (
          <p>{selectedDiscount && <>{selectedDiscount.percent}% تخفیف</>} + </p>
        )}
        <div>
          {price.toLocaleString()} <small>{currencyType()} </small>
        </div>
      </div>
    ) : (
      "رایگان"
    );
  };

  return (
    <>
      <NextSeo title={`خرید رویداد ${selectedCourse?.title}`} />
      <div id="buy-course">
        <MainBreadCrumb activeItem="ثبت نام در رویداد" />
        {!selectedCourse ? (
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
          <Row justify="center">
            <Col md={20} xs={24} id="buy-course-container">
              <Row>
                <Col md={18} xs={24}>
                  <div className="course-content-info">
                    <div className="course-content-title">
                      <img src="/assets/course/user.png" alt="slide" />
                      <div className="text-content">
                        <h1>ثبت نام در رویداد</h1>
                        <p>
                          کالاهای موجود در سبد شما ثبت و رزرو نشده‌اند، برای ثبت
                          سفارش مراحل بعدی را تکمیل کنید
                        </p>
                      </div>
                    </div>
                    <DiscountInput />
                    <CourseCheckoutInfo course={selectedCourse} />
                  </div>
                </Col>
                <Col md={6} xs={24}>
                  <div className="course-price-container">
                    <div className="course-total-price">
                      <span>مبلغ قابل پرداخت</span>
                      <div className="course-price">{renderPrice()}</div>
                    </div>
                    <Button block className={`buy-btn`} onClick={buyCourse}>
                      تایید و صدور فاکتور
                    </Button>
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

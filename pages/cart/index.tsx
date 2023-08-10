import { Button, Col, Empty, notification, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import DiscountInput from "./components/discountInput";
import { useRouter } from "next/dist/client/router";
import { useSelector } from "react-redux";
import { RootState } from "../../src/shared/store";
import ProductCheckoutInfo from "./components/productInfo";
import { NextSeo } from "next-seo";
import currencyType from "../../src/components/currency";

require("./style.less");

const Cart = () => {
  const { items } = useSelector((state: RootState) => state.cart);

  const router = useRouter();

  const total = () => {
    let total = 0;
    total = Math.ceil(
      items
        ?.map((item: any) => item?.price * item?.qty)
        .reduce((prev: any, curr: any) => prev + curr, 0)
    );

    return total;
  };

  return (
    <>
      <NextSeo title="سبد خرید" noindex />
      <div id="buy-product">
        <MainBreadCrumb activeItem="ثبت نام در رویداد" />
        {!items.length ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ margin: 30 }}
            style={{ margin: 100 }}
            description={<span>سبد خرید خالیست</span>}
          >
            <Button onClick={() => router.push("/shop")}>مشاهده کالاها </Button>
          </Empty>
        ) : (
          <Row justify="center">
            <Col md={20} xs={24} id="buy-product-container">
              <Row>
                <Col md={18} xs={24}>
                  <div className="product-content-info">
                    <div className="product-content-title">
                      <img src="/assets/shop/checkout.png" alt="slide" />
                      <div className="text-content">
                        <h1>سبد خرید</h1>
                        <p>
                          کالاهای موجود در سبد شما ثبت و رزرو نشده‌اند، برای ثبت
                          سفارش مراحل بعدی را تکمیل کنید
                        </p>
                      </div>
                    </div>
                    <DiscountInput count={items.length} />
                    {items.map((product) => (
                      <ProductCheckoutInfo key={product.id} product={product} />
                    ))}
                  </div>
                </Col>
                <Col md={6} xs={24}>
                  <div className="product-price-container">
                    <div className="product-total-price">
                      <span>مبلغ قابل پرداخت</span>
                      <div className="product-price">
                        {total() ? (
                          <>
                            {total().toLocaleString()}{" "}
                            <small>{currencyType()} </small>
                          </>
                        ) : (
                          "رایگان"
                        )}{" "}
                      </div>
                    </div>
                    <Button
                      block
                      className={`buy-btn`}
                      onClick={() => router.push("/checkout")}
                    >
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

export default Cart;

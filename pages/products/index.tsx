import { Button, Col, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";

require("./style.less");

const Products = () => {
  return (
    <>
      <NextSeo title={"سایر محصولات"} description={"سایر محصولات"} />
      <div id="products">
        <MainBreadCrumb activeItem="سایر محصولات" />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="event"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="products-container">
            <Fade bottom>
              <div className="products-card">
                <Row>
                  <Col md={12} xs={24} className="plan-content">
                    <div className="plan-title">
                      <div className="title-content">
                        <span>01</span>
                        <div>
                          <h1>پوستر الکترونیک</h1>
                          <p>
                            راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                          </p>
                        </div>
                      </div>
                      <ul>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                        <li>سامانه برگزاری انتخابات انجمن‌ها و سازمان‌ها</li>
                        <li>
                          سیستم مدیریت متمرکز ارئه سخنرانی‌های در محل رویداد (چک
                          اسلاید)
                        </li>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={12} xs={24}>
                    <div className="image-container">
                      <div
                        className="plan-image"
                        style={{
                          backgroundImage: `url('/assets/product-1.png`,
                        }}
                      ></div>
                      <div className="item-button">
                        <Link href={"#"}>اطلاعات بیشتر</Link>
                        <Link href={`/plan/`}>
                          <Button>
                            شروع کنید
                            <img
                              src="/assets/icons/arrow-left.png"
                              height={12}
                              width={18}
                              alt="arrow"
                            />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Fade>
            <Fade bottom>
              <div className="products-card right">
                <Row>
                  <Col md={12} xs={24} className="plan-content" order={1}>
                    <div className="plan-title">
                      <div className="title-content">
                        <span>02</span>
                        <div>
                          <h1>مدیریت الکترونیک</h1>
                          <p>
                            راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                          </p>
                        </div>
                      </div>
                      <ul>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                        <li>سامانه برگزاری انتخابات انجمن‌ها و سازمان‌ها</li>
                        <li>
                          سیستم مدیریت متمرکز ارئه سخنرانی‌های در محل رویداد (چک
                          اسلاید)
                        </li>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={12} xs={24}>
                    <div className="image-container">
                      <div
                        className="plan-image"
                        style={{
                          backgroundImage: `url('/assets/product-1.png`,
                        }}
                      ></div>
                      <div className="item-button right">
                        <Link href={"#"}>اطلاعات بیشتر</Link>
                        <Link href={`/plan/`}>
                          <Button>
                            شروع کنید
                            <img
                              src="/assets/icons/arrow-left.png"
                              height={12}
                              width={18}
                              alt="arrow"
                            />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Fade>
            <Fade bottom>
              <div className="products-card">
                <Row>
                  <Col md={12} xs={24} className="plan-content">
                    <div className="plan-title">
                      <div className="title-content">
                        <span>03</span>
                        <div>
                          <h1>اپلیکیشن رویداد</h1>
                          <p>
                            راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                          </p>
                        </div>
                      </div>
                      <ul>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                        <li>سامانه برگزاری انتخابات انجمن‌ها و سازمان‌ها</li>
                        <li>
                          سیستم مدیریت متمرکز ارئه سخنرانی‌های در محل رویداد (چک
                          اسلاید)
                        </li>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={12} xs={24}>
                    <div className="image-container">
                      <div
                        className="plan-image"
                        style={{
                          backgroundImage: `url('/assets/product-1.png`,
                        }}
                      ></div>
                      <div className="item-button">
                        <Link href={"#"}>اطلاعات بیشتر</Link>
                        <Link href={`/plan/`}>
                          <Button>
                            شروع کنید
                            <img
                              src="/assets/icons/arrow-left.png"
                              height={12}
                              width={18}
                              alt="arrow"
                            />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Fade>
            <Fade bottom>
              <div className="products-card right">
                <Row>
                  <Col md={12} xs={24} className="plan-content" order={1}>
                    <div className="plan-title">
                      <div className="title-content">
                        <span>04</span>
                        <div>
                          <h1>سامانه مدیریت رویداد</h1>
                          <p>
                            راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                          </p>
                        </div>
                      </div>
                      <ul>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                        <li>سامانه برگزاری انتخابات انجمن‌ها و سازمان‌ها</li>
                        <li>
                          سیستم مدیریت متمرکز ارئه سخنرانی‌های در محل رویداد (چک
                          اسلاید)
                        </li>
                        <li>
                          راه‌اندازی بخش ارائه مقالات پوستری به صورت الکترونیک
                        </li>
                        <li>
                          سامانه جامع مسابقات علمی و فرهنگی (عکس، فیلم و …)
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={12} xs={24}>
                    <div className="image-container">
                      <div
                        className="plan-image"
                        style={{
                          backgroundImage: `url('/assets/product-1.png`,
                        }}
                      ></div>
                      <div className="item-button right">
                        <Link href={"#"}>اطلاعات بیشتر</Link>
                        <Link href={`/plan/`}>
                          <Button>
                            شروع کنید
                            <img
                              src="/assets/icons/arrow-left.png"
                              height={12}
                              width={18}
                              alt="arrow"
                            />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Products;

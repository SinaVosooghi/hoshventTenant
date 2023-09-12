import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row, Tooltip, notification } from "antd";
import moment from "jalali-moment";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import { checkLogin, getUserFromCookie } from "../../src/util/utils";
import Service from "../../src/datamodel/Service";
import currencyType from "../../src/components/currency";
import HomeServices from "../../src/components/homepage/services";
import ExternalServices from "../../src/components/externalServices";
import ServicesSlider from "../../src/components/servicesSlider";
import { siteGetEventApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventApi";

import { useDispatch } from "react-redux";
import { Dispatch } from "../../src/shared/store";
import SeminarsSlider from "../../src/components/servicesSlider";
import WorkshopSlider from "../../src/components/workshopSlider";
import { useEffect, useState } from "react";
import { User } from "../../src/datamodel";

require("./style.less");

const PlanItem = () => {
  const router = useRouter();
  const { event } = router.query;
  const dispatch = useDispatch<Dispatch>();
  const [user, setUser] = useState<User | null>(null);

  const { data: eventApi } = useQuery(siteGetEventApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: event && event[0] },
  });

  const addToCart = () => {
    notification.success({
      message: `محصول اضافه شد`,
      description: (
        <>محصول {eventApi?.eventApi?.title} به سبد خرید شما اضافه شد.</>
      ),
    });
    dispatch.cart.addItem(eventApi?.eventApi);
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const renderButton = () => {
    var pastDate = moment(eventApi?.eventApi.end_date);

    const isPassed = moment().diff(pastDate, "days");

    if (isPassed > 1) {
      return <Button disabled>این رویداد پایان یافته</Button>;
    } else {
      return (
        <Tooltip title={!user ? "جهت خرید وارد حساب کاربری شوید" : ""}>
          <Button onClick={() => addToCart()} disabled={!user}>
            افزودن به سبد خرید
            <img src="/assets/icons/cart.png" width={18} alt="arrow" />
          </Button>
        </Tooltip>
      );
    }
  };

  return (
    <>
      <NextSeo
        title={eventApi?.eventApi?.title}
        description={eventApi?.eventApi?.seobody}
      />
      <div id="event">
        <MainBreadCrumb
          secondItem="رویداد ها"
          activeItem={eventApi?.eventApi?.title}
        />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="event"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="event-container">
            <Fade>
              <div id="event-card">
                <Row>
                  <Col md={10} xs={24} className="event-content">
                    <div className="event-title">
                      <h1>{eventApi?.eventApi?.title}</h1>
                      <p>{eventApi?.eventApi?.subtitle}</p>

                      <div className="event-dates">
                        {eventApi?.eventApi?.start_date && (
                          <div className="event-status">
                            <div className="status-item">
                              تاریخ شروع
                              <span>
                                {moment(eventApi?.eventApi?.start_date)
                                  .locale("fa")
                                  .format("YYYY MMM D")}{" "}
                                ساعت
                                {moment(eventApi?.eventApi?.start_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                        {eventApi?.eventApi?.end_date && (
                          <div className="event-status">
                            <div className="status-item">
                              تاریخ پایان
                              <span>
                                {moment(eventApi?.eventApi?.end_date)
                                  .locale("fa")
                                  .format("YYYY MMM D")}{" "}
                                ساعت
                                {moment(eventApi?.eventApi?.end_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {eventApi?.eventApi?.halls?.length ? (
                        <ul>
                          {eventApi?.eventApi?.halls?.map(
                            (service: Service) => {
                              return (
                                <li key={service.id}>
                                  {service.title}
                                  <ul>
                                    {service.workshops?.map(
                                      (service: Service) => {
                                        return (
                                          <li key={service.id}>
                                            {service.title}
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                  <ul>
                                    {service.seminars?.map(
                                      (service: Service) => {
                                        return (
                                          <li key={service.id}>
                                            {service.title}
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      ) : (
                        <></>
                      )}

                      {eventApi?.eventApi?.price ? (
                        <div className="item-button">
                          {renderButton()}

                          <div className="item-price">
                            {eventApi?.eventApi?.price && (
                              <p className="item-regular-price">
                                {eventApi?.eventApi?.price?.toLocaleString()}
                              </p>
                            )}
                            <span className="item-currency">
                              {eventApi?.eventApi?.price
                                ? currencyType()
                                : "رایگان"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="item-button">
                          <div className="item-price">
                            <p className="item-regular-price">رایگان</p>
                          </div>
                          <Link href={`/event/${eventApi?.eventApi.slug}`}>
                            <Button>اطلاعات بیشتر</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="event-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          eventApi?.eventApi?.image
                        }')`,
                      }}
                    ></div>
                  </Col>
                </Row>
              </div>
            </Fade>
            <Slide bottom>
              <HomeServices
                services={eventApi?.eventApi?.halls}
                title={
                  <>
                    سالن <strong> ها</strong>
                  </>
                }
                subtitle="سالن های یک همایش"
              />
            </Slide>

            <Fade>
              <img
                src="/assets/shadow.png"
                alt="event"
                className="shadow-seperator"
              />
            </Fade>
          </Col>

          <Col span={24}>
            <Slide bottom>
              <WorkshopSlider
                title="لیست"
                subTitle="ورکشاپ ها"
                seminars={eventApi?.eventApi?.halls}
              />
            </Slide>
          </Col>

          <Col span={24}>
            <Fade>
              <SeminarsSlider
                title="لیست"
                subTitle="سیمنار ها"
                seminars={eventApi?.eventApi?.halls}
              />
            </Fade>
          </Col>

          <Col span={20}>
            <Fade>
              <div className="event-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(eventApi?.eventApi?.updated)
                      .locale("fa")
                      .format("YYYY MMM D")}
                  </span>
                </div>
              </div>
              <div className="event-body">
                {eventApi?.eventApi?.body ? (
                  parse(eventApi?.eventApi?.body)
                ) : (
                  <></>
                )}
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PlanItem;

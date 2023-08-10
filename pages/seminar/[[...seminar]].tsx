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
import HomeServices from "../../src/components/homepage/services";
import SeminarsSlider from "../../src/components/servicesSlider";
import WorkshopSlider from "../../src/components/workshopSlider";
import { siteGetWorkshopApi } from "../../src/shared/apollo/graphql/queries/workshop/siteGetWorkshopApi";
import { siteGetSeminarApi } from "../../src/shared/apollo/graphql/queries/seminar/siteGetSeminarApi";
import currencyType from "../../src/components/currency";

require("./style.less");

const PlanItem = () => {
  const router = useRouter();
  const { seminar } = router.query;

  const { data: seminarApi } = useQuery(siteGetSeminarApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: seminar && seminar[0] },
  });

  return (
    <>
      <NextSeo
        title={seminarApi?.seminarApi.title}
        description={seminarApi?.seminarApi?.seobody}
      />
      <div id="event">
        <MainBreadCrumb
          secondItem="رویداد ها"
          activeItem={seminarApi?.seminarApi?.title}
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
                <Row gutter={[24, 24]}>
                  <Col md={10} xs={24} className="event-content">
                    <div className="event-title">
                      <h1>{seminarApi?.seminarApi?.title}</h1>
                      <p>{seminarApi?.seminarApi?.subtitle}</p>
                      <span className="type-pill">امکانات پایه</span>
                      {seminarApi?.seminarApi.seobody &&
                        parse(seminarApi?.seminarApi.seobody)}

                      <div className="item-button">
                        <div className="item-price">
                          {seminarApi?.seminarApi?.price && (
                            <p className="item-regular-price">
                              {seminarApi?.seminarApi?.price?.toLocaleString()}
                            </p>
                          )}
                          <span className="item-currency">
                            {seminarApi?.seminarApi?.price
                              ? currencyType()
                              : "رایگان"}
                          </span>
                        </div>
                        <Link
                          href={`/event/${seminarApi?.seminarApi.hall?.event?.slug}`}
                        >
                          <Button>جزییات رویداد</Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="event-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          seminarApi?.seminarApi?.image
                        }')`,
                      }}
                    ></div>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>

          <Col span={20}>
            <Fade>
              <div className="event-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(seminarApi?.seminarApi?.updated)
                      .locale("fa")
                      .format("YYYY MMM D")}
                  </span>
                </div>
              </div>
              <div className="event-body">
                {seminarApi?.seminarApi?.body ? (
                  parse(seminarApi?.seminarApi?.body)
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

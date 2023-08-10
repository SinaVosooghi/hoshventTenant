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
import currencyType from "../../src/components/currency";

require("./style.less");

const PlanItem = () => {
  const router = useRouter();
  const { workshop } = router.query;

  const { data: workshopApi } = useQuery(siteGetWorkshopApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: workshop && workshop[0] },
  });

  return (
    <>
      <NextSeo
        title={workshopApi?.workshopApi.title}
        description={workshopApi?.workshopApi?.seobody}
      />
      <div id="event">
        <MainBreadCrumb
          secondItem="رویداد ها"
          activeItem={workshopApi?.workshopApi?.title}
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
                      <h1>{workshopApi?.workshopApi?.title}</h1>
                      <p>{workshopApi?.workshopApi?.subtitle}</p>
                      <span className="type-pill">امکانات پایه</span>
                      {workshopApi?.workshopApi.seobody &&
                        parse(workshopApi?.workshopApi.seobody)}

                      <div className="item-button">
                        <div className="item-price">
                          {workshopApi?.workshopApi?.price && (
                            <p className="item-regular-price">
                              {workshopApi?.workshopApi?.price?.toLocaleString()}
                            </p>
                          )}
                          <span className="item-currency">
                            {workshopApi?.workshopApi?.price
                              ? currencyType()
                              : "رایگان"}
                          </span>
                        </div>
                        <Link
                          href={`/event/${workshopApi?.workshopApi.hall?.event?.slug}`}
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
                          workshopApi?.workshopApi?.image
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
                    {moment(workshopApi?.workshopApi?.updated)
                      .locale("fa")
                      .format("YYYY MMM D")}
                  </span>
                </div>
              </div>
              <div className="event-body">
                {workshopApi?.workshopApi?.body ? (
                  parse(workshopApi?.workshopApi?.body)
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

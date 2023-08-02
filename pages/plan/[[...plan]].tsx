import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row } from "antd";
import moment from "jalali-moment";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { siteGetPlanApi } from "../../src/shared/apollo/graphql/queries/plan/siteGetPlanApi";
import Lesson from "../../src/datamodel/Lesson";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { siteCheckAttend } from "../../src/shared/apollo/graphql/queries/attendees/siteCheckAttend";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import { checkLogin } from "../../src/util/utils";
import Service from "../../src/datamodel/Service";
import currencyType from "../../src/components/currency";
import HomeServices from "../../src/components/homepage/services";
import ExternalServices from "../../src/components/externalServices";
import ServicesSlider from "../../src/components/servicesSlider";

require("./style.less");

const PlanItem = ({}: // plansApi,
// planApi,
{
  // plansApi: [Plan];
  // planApi: any;
}) => {
  const router = useRouter();
  const { plan } = router.query;

  const { data: planApi, loading: planLoading } = useQuery(siteGetPlanApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: plan && plan[0] },
  });

  const { data: checkData, loading: checkUserLoading } = useQuery(
    siteCheckAttend,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        id: planApi?.planApi?.id,
      },
    }
  );

  const renderButton = (lesson: Lesson) => {
    if (!checkLogin()) {
      if (!lesson?.public) {
        return (
          <Link href={"/login"} target="_blank">
            <Button> وارد حساب کاربری شوید </Button>
          </Link>
        );
      }
    }

    if (!checkData?.checkPlanApi.alreadyBought) {
      if (!lesson?.public) {
        return <Button disabled> خرید دوره</Button>;
      }
    }

    switch (lesson?.type) {
      case "conference": {
        const isBefore = moment().isBefore(lesson.conferenceoptions?.startdate); // true
        if (!isBefore) {
          return <Button disabled>برگزار شده</Button>;
        }
        return (
          <Link
            href={lesson?.conferenceoptions?.joinlink ?? "#"}
            target="_blank"
          >
            <Button>شرکت در کلاس آنلاین</Button>
          </Link>
        );
      }
      case "text":
        return (
          <Button
            onClick={() => {
              router.push(`/lesson/${lesson?.slug}`);
            }}
          >
            مشاهده کلاس
          </Button>
        );
      case "video": {
        if (lesson.videooptions.type === "video") {
          return (
            <Button
              onClick={() => {
                router.push(`/lesson/${lesson?.slug}`);
              }}
            >
              مشاهده کلاس
            </Button>
          );
        } else {
          return (
            <Link href={lesson?.videooptions?.link ?? "#"} target="_blank">
              <Button>مشاهده ویدئو</Button>
            </Link>
          );
        }
      }
      default:
        return (
          <Button
            onClick={() => {
              router.push(`/lesson/${lesson.slug}`);
            }}
          >
            مشاهده کلاس
          </Button>
        );
    }
  };

  const renderCapacity = () => {
    if (checkData?.checkplanApi?.planApi?.outOfCapacity) {
      return <span> تکمیل ظرفیت </span>;
    }

    return planApi?.planApi?.capacity ? (
      <span>{planApi?.planApi?.capacity} نفر</span>
    ) : (
      <span> نا محدود</span>
    );
  };

  return (
    <>
      <NextSeo title={planApi?.title} description={planApi?.planApi?.seobody} />
      <div id="plan">
        <MainBreadCrumb
          secondItem="پکیج ها"
          activeItem={planApi?.planApi?.title}
        />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="event"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="plan-container">
            <Fade>
              <div id="plan-card">
                <Row>
                  <Col md={10} xs={24} className="plan-content">
                    <div className="plan-title">
                      <h1>{planApi?.planApi?.title}</h1>
                      <p>{planApi?.planApi?.subtitle}</p>
                      <span className="type-pill">امکانات پایه</span>
                      {planApi?.planApi?.services?.length ? (
                        <ul>
                          {planApi?.planApi?.services?.map(
                            (service: Service) => {
                              return <li key={service.id}>{service.title}</li>;
                            }
                          )}
                        </ul>
                      ) : (
                        <></>
                      )}

                      {planApi?.planApi?.price ? (
                        <div className="item-button">
                          <Link href={`/plan/${planApi?.planApi.slug}`}>
                            <Button>
                              درخواست
                              <img
                                src="/assets/icons/arrow-left.png"
                                height={12}
                                width={18}
                                alt="arrow"
                              />
                            </Button>
                          </Link>
                          <div className="item-price">
                            {planApi?.planApi?.price && (
                              <p className="item-regular-price">
                                {planApi?.planApi?.price?.toLocaleString()}
                              </p>
                            )}
                            <span className="item-currency">
                              {planApi?.planApi?.price
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
                          <Link href={`/plan/${planApi?.planApi.slug}`}>
                            <Button>اطلاعات بیشتر</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="plan-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          planApi?.planApi?.image
                        }')`,
                      }}
                    ></div>
                  </Col>
                </Row>
              </div>
            </Fade>
            <Slide bottom>
              <HomeServices
                services={planApi?.planApi?.services}
                title={
                  <>
                    ویژگی های <strong> محصول</strong>
                  </>
                }
                subtitle="ویژگی های یک همایش خاص"
              />
            </Slide>

            <Fade>
              <img
                src="/assets/shadow.png"
                alt="event"
                className="shadow-seperator"
              />
            </Fade>

            <Slide bottom>
              <ExternalServices />
            </Slide>
          </Col>

          <Col span={24}>
            <Fade>
              <ServicesSlider title="لیست" subTitle="قیمت امکانات" />
            </Fade>
          </Col>

          <Col span={20}>
            <Fade>
              <div className="plan-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(planApi?.planApi?.updated)
                      .locale("fa")
                      .format("YYYY MMM D")}
                  </span>
                </div>
              </div>
              <div className="plan-body">
                {planApi?.planApi?.body ? parse(planApi?.planApi?.body) : <></>}
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

// export async function getStaticProps({ params }: { params: any }) {
//   const {
//     data: { planApi },
//   } = await client.query({
//     query: siteGetPlanApi,
//     variables: { slug: params.plan[0] },
//   });

//   const {
//     data: { plansApi },
//   } = await client.query({
//     query: siteGetPlansApi,
//     variables: { input: { skip: 0, limit: 135 } },
//   });

//   return {
//     props: {
//       planApi: planApi,
//       plansApi: plansApi.plans,
//     },
//     revalidate: 180,
//   };
// }

// export async function getStaticPaths() {
//   const {
//     data: { plansApi },
//   } = await client.query({
//     query: siteGetPlansApi,
//     variables: { input: { skip: 0, limit: 135 } },
//   });

//   return {
//     paths: plansApi.plans.map((blog: any) => `/plan/${blog.slug}`),
//     fallback: "blocking",
//   };
// }

export default PlanItem;

import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row } from "antd";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { siteGetEventApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventApi";
import EventInfo from "./info";
import Lesson from "../../src/datamodel/Lesson";
import Link from "next/link";
import { ClockCircleOutlined } from "@ant-design/icons";
import EventSlider from "../../src/components/sections/featured/featured";
import { NextSeo } from "next-seo";
import { siteGetEventsApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventsApi";
import { siteCheckAttend } from "../../src/shared/apollo/graphql/queries/attendees/siteCheckAttend";
// @ts-ignore
import { Fade } from "react-reveal";
import Review from "../../src/components/review";
import { checkLogin } from "../../src/util/utils";
import Event from "../../src/datamodel/Event";

require("./style.less");

const EventItem = ({}: // eventsApi,
// eventApi,
{
  // eventsApi: [Event];
  // eventApi: any;
}) => {
  const router = useRouter();
  const { event } = router.query;

  const { data, loading } = useQuery(siteGetEventsApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: event && event[0] },
  });

  const { data: eventApi, loading: eventLoading } = useQuery(siteGetEventApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: event && event[0] },
  });

  const { data: checkData, loading: checkUserLoading } = useQuery(
    siteCheckAttend,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        id: eventApi?.eventApi?.id,
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

    if (!checkData?.checkEventApi.alreadyBought) {
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
    if (checkData?.checkeventApi?.eventApi?.outOfCapacity) {
      return <span> تکمیل ظرفیت </span>;
    }

    return eventApi?.eventApi?.capacity ? (
      <span>{eventApi?.eventApi?.capacity} نفر</span>
    ) : (
      <span> نا محدود</span>
    );
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
        <Row justify="center">
          <Col md={20} xs={24} id="event-container">
            <Fade>
              <div>
                <Row>
                  <Col md={7} xs={24} order={1}>
                    <EventInfo
                      event={eventApi?.eventApi?.event}
                      checkData={checkData}
                      loading={checkUserLoading}
                    />
                  </Col>
                  <Col md={17} xs={24} className="event-content">
                    <div className="event-title">
                      <span>دوره</span>
                      <h1>{eventApi?.eventApi?.title}</h1>
                    </div>
                    <div className="event-image">
                      {eventApi?.eventApi?.image && (
                        <Image
                          alt={eventApi?.eventApi?.seotitle}
                          src={
                            process.env.NEXT_PUBLIC_SITE_URL +
                            "/" +
                            eventApi?.eventApi?.image
                          }
                          fill
                          sizes="100vw"
                        />
                      )}
                    </div>
                    <div className="event-status">
                      <div className="status-item">
                        ظرفیت دوره
                        {renderCapacity()}
                      </div>
                      <div className="status-item">
                        آخرین به روزرسانی
                        <span>
                          {moment(eventApi?.eventApi?.updated).format(
                            "YYYY/M/D"
                          )}
                        </span>
                      </div>
                    </div>
                    {eventApi?.eventApi?.body && (
                      <div className="event-body">
                        {parse(eventApi?.eventApi?.body)}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
        {/* <EventSlider
          items={eventsApi}
          title="دوره های"
          subTitle="مرتبط"
          hideShowMore
        /> */}

        {eventApi?.eventApi?.id && (
          <Review
            type="event"
            itemTitle={eventApi?.eventApi?.title}
            itemId={eventApi?.eventApi?.id}
            overall={eventApi?.eventApi?.overall}
            answers={eventApi?.eventApi?.answers}
          />
        )}
      </div>
    </>
  );
};

// export async function getStaticProps({ params }: { params: any }) {
//   const {
//     data: { eventApi },
//   } = await client.query({
//     query: siteGetEventApi,
//     variables: { slug: params.event[0] },
//   });

//   const {
//     data: { eventsApi },
//   } = await client.query({
//     query: siteGetEventsApi,
//     variables: { input: { skip: 0, limit: 135 } },
//   });

//   return {
//     props: {
//       eventApi: eventApi,
//       eventsApi: eventsApi.events,
//     },
//     revalidate: 180,
//   };
// }

// export async function getStaticPaths() {
//   const {
//     data: { eventsApi },
//   } = await client.query({
//     query: siteGetEventsApi,
//     variables: { input: { skip: 0, limit: 135 } },
//   });

//   return {
//     paths: eventsApi.events.map((blog: any) => `/event/${blog.slug}`),
//     fallback: "blocking",
//   };
// }

export default EventItem;

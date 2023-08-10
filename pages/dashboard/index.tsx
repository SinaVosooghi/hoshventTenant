import {
  BookOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row, Space, Statistic, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Lesson from "../../src/datamodel/Lesson";
import { siteGetAttendees } from "../../src/shared/apollo/graphql/queries/attendees/siteGetAttendees";
import { siteGetCourses } from "../../src/shared/apollo/graphql/queries/event/siteGetEvents";
import { siteGetLessons } from "../../src/shared/apollo/graphql/queries/lesson/siteGetLessons";
import Lessons from "./lessons";
import Events from "./events";

import { NextSeo } from "next-seo";
import moment from "moment";
import { siteGetEventsApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventsApi";

const TeachersDashboard = () => {
  const router = useRouter();

  const [lastConference, setLastConference] = useState<Lesson | null>(null);
  const { data: eventsApi, loading: courseLoading } = useQuery(
    siteGetEventsApi,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        input: {
          skip: 0,
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    }
  );

  useMemo(() => {
    if (eventsApi?.eventsApi) {
      eventsApi.eventsApi?.events?.map((attend: any) => {
        attend.sections?.map((section: any) => {
          section?.lessons?.map(({ lesson }: { lesson: Lesson }) => {
            if (lesson?.type === "conference") {
              setLastConference(lesson);
            }
          });
        });
      });
    }
  }, [eventsApi]);

  const { data: lessons, loading } = useQuery(siteGetLessons, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 1,
        skip: 0,
      },
    },
  });

  const { data: attendeesApi, loading: attendLoading } = useQuery(
    siteGetAttendees,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        input: {
          limit: 1,
          skip: 0,
        },
      },
    }
  );

  const joinButton = (lastConference: Lesson) => {
    const isBefore = moment().isBefore(
      lastConference?.conferenceoptions?.startdate
    );
    if (!isBefore) {
      return <Button disabled>برگزار شده</Button>;
    }

    return (
      <Tooltip title={lastConference?.conferenceoptions?.starturl ?? ""}>
        <a href={lastConference?.conferenceoptions?.starturl}>
          <Button
            disabled={!lastConference?.conferenceoptions?.starturl}
            type="dashed"
            target="_blank"
          >
            لینک شروع کلاس
          </Button>
        </a>
      </Tooltip>
    );
  };

  return (
    <>
      <NextSeo title="پنل مدیریت" />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="داشبورد"
            extra={
              <Space>
                <Button
                  onClick={() => router.push("/dashboard/lessons/add")}
                  type="primary"
                  icon={<PlusOutlined rev={undefined} />}
                  ghost
                >
                  افزودن تیکت پشتیبانی{" "}
                </Button>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={5}>
                <Statistic
                  title="تعداد رویداد ها"
                  loading={loading}
                  value={eventsApi?.eventsApi?.count}
                  prefix={<ReadOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
                  loading={attendLoading}
                  title="تعداد کل شرکت کنندگان"
                  value={attendeesApi?.attendeesApi?.count}
                  prefix={<UserOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
                  loading={attendLoading}
                  title="اسکن QR CODE"
                  value=" "
                  suffix={
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => router.push("/dashboard/scanner")}
                    >
                      اسکن QR Code
                    </Button>
                  }
                  prefix={<QrcodeOutlined rev={undefined} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Events />
        </Col>
      </Row>
    </>
  );
};

export default TeachersDashboard;

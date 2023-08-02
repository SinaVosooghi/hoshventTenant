import {
  BookOutlined,
  PlusOutlined,
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
import Courses from "./courses";

import { NextSeo } from "next-seo";
import moment from "moment";

const TeachersDashboard = () => {
  const router = useRouter();

  const [lastConference, setLastConference] = useState<Lesson | null>(null);
  const { data: courses, loading: courseLoading } = useQuery(siteGetCourses, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
      },
    },
  });

  useMemo(() => {
    if (courses?.courses) {
      courses.courses?.courses?.map((attend: any) => {
        attend.sections?.map((section: any) => {
          section?.lessons?.map(({ lesson }: { lesson: Lesson }) => {
            if (lesson?.type === "conference") {
              setLastConference(lesson);
            }
          });
        });
      });
    }
  }, [courses]);

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
                  افزودن کلاس
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/courses/add")}
                  type="primary"
                  icon={<PlusOutlined rev={undefined} />}
                  ghost
                >
                  افزودن دوره
                </Button>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={5}>
                <Statistic
                  title="تعداد دوره ها"
                  loading={loading}
                  value={courses?.courses?.count}
                  prefix={<ReadOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
                  title="تعداد کلاس ها "
                  loading={courseLoading}
                  value={lessons?.lessons?.count}
                  prefix={<BookOutlined rev={undefined} />}
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
              {lastConference && (
                <Col span={9}>
                  <Statistic title="آخرین کلاس" value={lastConference.title} />
                  {joinButton(lastConference)}
                </Col>
              )}
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Courses hideCount />
        </Col>
        <Col span={24}>
          <Lessons hideCount />
        </Col>
      </Row>
    </>
  );
};

export default TeachersDashboard;

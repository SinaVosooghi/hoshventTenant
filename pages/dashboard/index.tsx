import {
  BookOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ReadOutlined,
  ScanOutlined,
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
import moment from "jalali-moment";
import { siteGetEventsApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventsApi";
import { siteGetScans } from "../../src/shared/apollo/graphql/queries/scan/siteGetWorkshops";
import { siteGetWorkshops } from "../../src/shared/apollo/graphql/queries/workshop/siteGetWorkshops";
import { siteGetSminarsApi } from "../../src/shared/apollo/graphql/queries/seminar/siteGetSeminarsApi";

const TeachersDashboard = () => {
  const router = useRouter();

  const { data: workshopsApi, loading: workshopLoading } = useQuery(
    siteGetWorkshops,
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

  const { data: seminarApi, loading: seminarLoading } = useQuery(
    siteGetSminarsApi,
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

  const { data: scanData, loading: scanLoading } = useQuery(siteGetScans, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

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
                  onClick={() => router.push("/dashboard/chats/")}
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
                  title="تعداد ورکشاپ ها"
                  loading={workshopLoading}
                  value={workshopsApi?.workshopsApi?.count}
                  prefix={<ReadOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
                  loading={seminarLoading}
                  title="تعداد کل	رویداد جانبی "
                  value={seminarApi?.seminarsApi  ?.count}
                  prefix={<UserOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
                  loading={scanLoading}
                  title="تعداد اسکن ها"
                  value={scanData?.scans?.count}
                  prefix={<ScanOutlined rev={undefined} />}
                />
              </Col>
              <Col span={5}>
                <Statistic
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

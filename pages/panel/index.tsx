import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row, Statistic } from "antd";
import { FC, useMemo, useState } from "react";
import Lesson from "../../src/datamodel/Lesson";
import moment from "moment";
import dynamic from "next/dynamic";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";
import { siteGetToken } from "../../src/shared/apollo/graphql/queries/jitsi/siteGetToken";
import { siteGetUserEventsApi } from "../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
import Events from "./events";
import Calendar from "./components/calendar";
import Link from "next/link";

const JaaSMeeting = dynamic(
  () =>
    import("@jitsi/react-sdk").then(({ JaaSMeeting }) => JaaSMeeting) as any,
  {
    ssr: false,
  }
) as FC<IJitsiMeetingProps>;

const TeachersDashboard = () => {
  const [lastEvent, setLastEvent] = useState<Lesson | null>(null);

  const { data: userEventsApi, loading: courseLoading } = useQuery(
    siteGetUserEventsApi,
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

  useMemo(() => {
    if (userEventsApi?.userEventsApi) {
      userEventsApi.userEventsApi?.attends?.map((attend: any) => {
        setLastEvent(attend.event);
      });
    }
  }, [userEventsApi]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="داشبورد">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="تعداد رویداد ها"
                loading={courseLoading}
                value={userEventsApi?.userEventsApi?.count}
              />
            </Col>
            {lastEvent && (
              <Col span={8}>
                <Statistic title="آخرین رویداد" value={lastEvent.title} />
                <Link href={`/panel/events/view/?id=${lastEvent?.id}`} target="_blank">
                  <Button>جزییات رویداد</Button>
                </Link>
              </Col>
            )}
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Calendar />
      </Col>
      <Col span={24}>
        <Events />
      </Col>
    </Row>
  );
};

export default TeachersDashboard;

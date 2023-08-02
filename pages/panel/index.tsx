import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row, Statistic } from "antd";
import { FC, useMemo, useState } from "react";
import Lesson from "../../src/datamodel/Lesson";
import { siteGetUserCoursesApi } from "../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
import Courses from "./courses";
import moment from "moment";
import dynamic from "next/dynamic";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";
import { siteGetToken } from "../../src/shared/apollo/graphql/queries/jitsi/siteGetToken";

const JaaSMeeting = dynamic(
  () =>
    import("@jitsi/react-sdk").then(({ JaaSMeeting }) => JaaSMeeting) as any,
  {
    ssr: false,
  }
) as FC<IJitsiMeetingProps>;

const TeachersDashboard = () => {
  const [lastConference, setLastConference] = useState<Lesson | null>(null);

  const { data: courses, loading: courseLoading } = useQuery(
    siteGetUserCoursesApi,
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

  const { data: token, loading } = useQuery(siteGetToken, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useMemo(() => {
    if (courses?.userCoursesApi) {
      courses.userCoursesApi?.attends?.map((attend: any) => {
        attend.course?.sections?.map((section: any) => {
          section?.lessons?.map(({ lesson }: { lesson: Lesson }) => {
            if (lesson?.type === "conference") {
              setLastConference(lesson);
            }
          });
        });
      });
    }
  }, [courses]);

  const joinButton = (lastConference: Lesson) => {
    const isBefore = moment().isBefore(
      lastConference?.conferenceoptions?.startdate
    );
    if (!isBefore) {
      return <Button disabled>برگزار شده</Button>;
    }

    return (
      <a href={lastConference?.conferenceoptions?.joinlink}>
        <Button
          disabled={!lastConference?.conferenceoptions?.joinlink}
          type="dashed"
          target="_blank"
        >
          لینک ورود به کلاس
        </Button>
      </a>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      {token && token?.getToken && (
        <JaaSMeeting
          roomName={`${process.env.NEXT_PUBLIC_JITSI_APP_ID + "/" + "test"}`}
          jwt={token?.getToken}
          configOverwrite={{
            disableThirdPartyRequests: true,
            disableLocalVideoFlip: true,
            backgroundAlpha: 0.5,
            defaultLanguage: "fa",
          }}
          interfaceConfigOverwrite={{
            VIDEO_LAYOUT_FIT: "nocrop",
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "800px";
            iframeRef.style.width = "100%";
          }}
        />
      )}

      <Col span={24}>
        <Card title="داشبورد">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="تعداد دوره ها"
                loading={courseLoading}
                value={courses?.userCoursesApi?.count}
              />
            </Col>
            {lastConference && (
              <Col span={8}>
                <Statistic title="آخرین کلاس" value={lastConference.title} />
                {joinButton(lastConference)}
              </Col>
            )}
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Courses />
      </Col>
    </Row>
  );
};

export default TeachersDashboard;

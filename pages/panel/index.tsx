import { useQuery } from "@apollo/client";
import { Button, Card, Col, Row, Space, Statistic, Typography } from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import Lesson from "../../src/datamodel/Lesson";
import moment from "moment";
import dynamic from "next/dynamic";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";
import { siteGetToken } from "../../src/shared/apollo/graphql/queries/jitsi/siteGetToken";
import { siteGetUserEventsApi } from "../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
import Events from "./events";
import Calendar from "./components/calendar";
import Link from "next/link";

import { ReactQrCode } from "@devmehq/react-qr-code";
import reactSvgToImage from "react-svg-to-image";
import { getUserFromCookie } from "../../src/util/utils";
import PrintableCard from "../../src/components/printCard";
import { User } from "../../src/datamodel";
import useGetSetting from "../../src/hooks/useGetSetting";
import Setting from "../../src/datamodel/Setting";

const { Text, Paragraph } = Typography;

const TeachersDashboard = () => {
  const [lastEvent, setLastEvent] = useState<Lesson | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { data: siteData }: { data: Setting } = useGetSetting();

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

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  useMemo(() => {
    if (userEventsApi?.userEventsApi) {
      userEventsApi.userEventsApi?.attends?.map((attend: any) => {
        setLastEvent(attend.event);
      });
    }
  }, [userEventsApi]);

  const qrDownloader = () => {
    reactSvgToImage("#qr", "QRCODE", {
      scale: 3,
      download: true,
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="کارت ورود">
          <Row gutter={16}>
            <Col>
              {user && (
                <div className="qrcode">
                  <ReactQrCode
                    value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
                    size={160}
                    viewBox={`0 0 185 185`}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                    }}
                    renderAs="canvas"
                    id="qr"
                  />
                </div>
              )}
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <Space direction="vertical" size={8}>
                  <Text strong>رمزینه پاسخ سریع (QRCode)</Text>
                  <Paragraph>
                    این کد را در اختیار عوامل اجرای قرار دهید.
                  </Paragraph>
                </Space>
                <Space>
                  <Button onClick={qrDownloader}>دانلود QR Code</Button>
                  <a href="path_to_file" id="link" download="qr_code"></a>
                </Space>
              </Space>
            </Col>
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
                <Link
                  href={`/panel/events/view/?id=${lastEvent?.id}`}
                  target="_blank"
                >
                  <Button>جزییات رویداد</Button>
                </Link>
              </Col>
            )}
          </Row>
        </Card>
      </Col>
      <Card title="کارت ورود">
        {user && (
          <PrintableCard
            showCard={false}
            boxes={siteData}
            name={`${user?.firstName} ${user?.lastName}`}
            event={"کارت ورود"}
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
            user={user}
            setUser={setUser}
            showThumbnail
          />
        )}
      </Card>
      <Col span={24}>
        <Calendar />
      </Col>
      {/* <Col span={24}> ///////////////////////////////////////////////////////////////////////
        <Events />
      </Col> */}
    </Row>
  );
};

export default TeachersDashboard;

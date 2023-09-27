/* eslint-disable react/jsx-no-target-blank */
import { useQuery } from "@apollo/client";
import {
  Alert,
  Badge,
  Button,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Card,
  Typography,
} from "antd";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Link from "next/link";
import Lesson from "../../../../src/datamodel/Lesson";
import moment from "jalali-moment";
import parse from "html-react-parser";
import { siteGetEvent } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";

import { ReactQrCode } from "@devmehq/react-qr-code";
import reactSvgToImage from "react-svg-to-image";
import { useEffect, useState } from "react";
import { getUserFromCookie } from "../../../../src/util/utils";
import { User } from "../../../../src/datamodel";
import { siteGetWorkshopApi } from "../../../../src/shared/apollo/graphql/queries/workshop/siteGetWorkshopApi";
import PrintableCard from "../../../../src/components/printCard";
import useGetSetting from "../../../../src/hooks/useGetSetting";
import Setting from "../../../../src/datamodel/Setting";
const { Text, Paragraph } = Typography;

const Edit = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { data: siteData }: { data: Setting } = useGetSetting();

  const { id } = router.query;
  const { data, loading } = useQuery(siteGetWorkshopApi, {
    fetchPolicy: "network-only",
    variables: { slug: id },
  });

  const qrDownloader = () => {
    reactSvgToImage("#qr", data?.workshopApi?.title, {
      scale: 3,
      download: true,
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  return (
    <>
      <NextSeo title={data?.workshopApi?.title} />
      <Card title={`جزییات ${data?.workshopApi?.title}`} loading={loading}>
        <Row gutter={[24, 24]}>
          <Col>
            {user && (
              <div className="qrcode">
                <ReactQrCode
                  value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}&w=${data?.workshopApi?.id}`}
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
                <PrintableCard
                  boxes={siteData}
                  name={`${user?.firstName} ${user?.lastName}`}
                  event={data?.workshopApi?.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.id}&w=${data?.workshopApi?.id}`}
                />
              </div>
            )}
          </Col>
          <Col>
            <Space direction="vertical" size={0}>
              <Space direction="vertical" size={0}>
                <Text strong>رمزینه پاسخ سریع (QRCode)</Text>
                <Paragraph>
                  این کد را در اختیار عوامل اجرای قرار دهید.
                </Paragraph>
              </Space>
              <Button size="small" onClick={qrDownloader}>
                دانلود QR Code
              </Button>
              <a href="path_to_file" id="link" download="qr_code"></a>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Edit;

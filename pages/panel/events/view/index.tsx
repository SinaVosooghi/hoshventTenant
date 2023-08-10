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
  Tag,
  Typography,
} from "antd";
import Card from "antd/es/card/Card";
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
const { Text, Paragraph } = Typography;

const Edit = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const { id } = router.query;
  const { data, loading } = useQuery(siteGetEvent, {
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
  });

  const qrDownloader = () => {
    reactSvgToImage("#qr", data?.event?.title, {
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
      <NextSeo title={data?.event?.title} />
      <Card title={`جزییات ${data?.event?.title}`} loading={loading}>
        <Row gutter={[24, 24]}>
          <Col>
            {user && (
              <div className="qrcode">
                <ReactQrCode
                  value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}&e=${data?.event?.id}`}
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
        {data?.event?.halls.length > 0 ? (
          <Row gutter={[12, 12]}>
            {
              // @ts-ignore
              data?.event?.halls.toReversed().map((hall, idx) => {
                if (hall.title) {
                  return (
                    <Col span={24} key={idx}>
                      <div title={hall?.title ?? "-"}>
                        <List
                          header={<div>{hall?.title}</div>}
                          bordered
                          dataSource={[...hall.workshops, ...hall.seminars]}
                          renderItem={(item: any, idx) => {
                            return (
                              <List.Item key={idx}>
                                <Descriptions title={item.title}>
                                  <Descriptions.Item label="عنوان">
                                    {item.title}
                                  </Descriptions.Item>
                                  {item?.start_date && (
                                    <Descriptions.Item label=" تاریخ شروع کلاس">
                                      <Alert
                                        message={
                                          moment
                                            .utc(item?.start_date)
                                            .locale("fa")
                                            .format("ddd D MMM, YYYY") ?? "-"
                                        }
                                        type="info"
                                      />
                                    </Descriptions.Item>
                                  )}
                                  {item?.start_date && (
                                    <Descriptions.Item label=" ساعت شروع کلاس">
                                      <Alert
                                        message={
                                          moment
                                            .utc(item?.start_date)
                                            .locale("fa")
                                            .format("H:mm") ?? "-"
                                        }
                                        type="info"
                                      />
                                    </Descriptions.Item>
                                  )}
                                  {item.price && (
                                    <Descriptions.Item label="قیمت">
                                      {item.price.toLocaleString()} تومان
                                    </Descriptions.Item>
                                  )}
                                  {item.duration && (
                                    <Descriptions.Item label="طول رویداد">
                                      {item.duration ?? "-"}
                                    </Descriptions.Item>
                                  )}
                                  {item.body && (
                                    <Descriptions.Item label="توضیحات کوتاه">
                                      {item?.body && parse(item.body)}
                                    </Descriptions.Item>
                                  )}
                                </Descriptions>
                                <Descriptions.Item>
                                  <Button
                                    onClick={() => {
                                      router.push(`/event/${data?.event.slug}`);
                                    }}
                                  >
                                    مشاهده جزییات
                                  </Button>
                                </Descriptions.Item>
                              </List.Item>
                            );
                          }}
                        />
                      </div>
                    </Col>
                  );
                }
              })
            }
          </Row>
        ) : (
          <p>این رویداد جزییاتی ندارد</p>
        )}
      </Card>
    </>
  );
};

export default Edit;

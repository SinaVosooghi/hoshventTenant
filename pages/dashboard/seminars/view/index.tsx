/* eslint-disable react/jsx-no-target-blank */
import { useQuery } from "@apollo/client";
import {
  Alert,
  Button,
  Col,
  Descriptions,
  List,
  Row,
  Card,
} from "antd";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import parse from "html-react-parser";
import { siteGetEvent } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(siteGetEvent, {
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
  });

  return (
    <>
      <NextSeo title={data?.event?.title} />
      <Card title={`جزییات ${data?.event?.title}`} loading={loading}>
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
                                      router.push(
                                        `/event/${data?.event.slug}`
                                      );
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

import { useQuery } from "@apollo/client";
import { Badge, Button, Col, Descriptions, Divider, List, Row } from "antd";
import Card from "antd/es/card/Card";
import { useRouter } from "next/router";
import { siteGetCourse } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";
import parse from "html-react-parser";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery(siteGetCourse, {
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
  });

  return (
    <>
      مشاهده {data?.course?.title} <Divider />
      <Row gutter={[12, 12]}>
        {
          // @ts-ignore
          data?.course?.sections.map((section, idx) => {
            if (section.title) {
              return (
                <Col span={24} key={idx}>
                  <div title={section?.title ?? "-"}>
                    <List
                      header={<div>کلاس</div>}
                      bordered
                      dataSource={section.lessons ?? []}
                      renderItem={(item: any, idx) => {
                        return (
                          <List.Item key={idx}>
                            <Descriptions title={item.lesson.title}>
                              <Descriptions.Item label="عنوان">
                                {item.lesson.title}
                              </Descriptions.Item>
                              <Descriptions.Item label="نوع">
                                {item.lesson?.type}
                              </Descriptions.Item>
                              <Descriptions.Item label="طول رویداد">
                                {item.lesson.duration ?? "-"}
                              </Descriptions.Item>
                              <Descriptions.Item label="عمومی">
                                <Badge />
                              </Descriptions.Item>
                              <Descriptions.Item label="توضیحات کوتاه">
                                {item?.lesson?.excerpt &&
                                  parse(item.lesson.excerpt)}
                              </Descriptions.Item>
                              {item.lesson?.type === "conference" && (
                                <Descriptions.Item label="لینک">
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      window.open(
                                        item.lesson.conferenceoptions.joinlink
                                      )
                                    }
                                  >
                                    لینک جوین
                                  </Button>
                                </Descriptions.Item>
                              )}
                            </Descriptions>
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
    </>
  );
};

export default Edit;

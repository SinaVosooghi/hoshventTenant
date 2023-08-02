import { useQuery } from "@apollo/client";
import { Badge, Button, Col, Descriptions, Divider, List, Row } from "antd";
import Card from "antd/es/card/Card";
import { useRouter } from "next/router";
import { siteGetCourse } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";

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
      View {data?.course?.title} <Divider />
      <Row gutter={[12, 12]}>
        {
          // @ts-ignore
          data?.course?.sections.map((section, idx) => {
            if (section.title) {
              return (
                <Col span={24} key={idx}>
                  <div title={section?.title ?? "-"}>
                    <List
                      header={<div>Lessons</div>}
                      bordered
                      dataSource={section.lessons ?? []}
                      renderItem={(item: any, idx) => {
                        return (
                          <List.Item key={idx}>
                            <Descriptions title={item.lesson.title}>
                              <Descriptions.Item label="Title">
                                {item.lesson.title}
                              </Descriptions.Item>
                              <Descriptions.Item label="Type">
                                {item.lesson?.type}
                              </Descriptions.Item>
                              <Descriptions.Item label="Duration">
                                {item.lesson.duration ?? "-"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Is public">
                                <Badge />
                              </Descriptions.Item>
                              <Descriptions.Item label="Excerpt">
                                {item.lesson.excerpt}
                              </Descriptions.Item>
                              {item.lesson?.type === "conference" && (
                                <Descriptions.Item label="Create">
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      window.open(
                                        item.lesson.conferenceoptions.joinlink
                                      )
                                    }
                                  >
                                    Create class link
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

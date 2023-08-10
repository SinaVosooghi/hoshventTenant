/* eslint-disable react/jsx-no-target-blank */
import { useQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Tag,
} from "antd";
import Card from "antd/es/card/Card";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { siteGetCourse } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";
import Link from "next/link";
import Lesson from "../../../../src/datamodel/Lesson";
import moment from "moment";
import parse from "html-react-parser";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery(siteGetCourse, {
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
  });

  const renderButton = (lesson: Lesson) => {
    switch (lesson?.type) {
      case "conference": {
        const isBefore = moment().isBefore(
          lesson?.conferenceoptions?.startdate
        );
        if (!isBefore && lesson.type === "conference") {
          return <Button disabled>برگزار شده</Button>;
        }

        return (
          <a
            href={"/panel/conference/" + lesson?.slug}
            target="_blank"
            rel="noreferrer"
          >
            <Button type="dashed" target="_blank">
              شرکت در کلاس آنلاین
            </Button>
          </a>
        );
      }

      case "text":
        return (
          <Button
            type="primary"
            onClick={() => {
              router.push(`/lesson/${lesson.slug}`);
            }}
          >
            مشاهده کلاس
          </Button>
        );
      case "video": {
        if (lesson.videooptions.type === "video") {
          return (
            <Button
              type="primary"
              onClick={() => {
                router.push(`/lesson/${lesson.slug}`);
              }}
            >
              مشاهده کلاس
            </Button>
          );
        } else {
          return (
            <Link href={lesson?.videooptions?.link ?? "#"} target="_blank">
              <Button type="primary">مشاهده ویدئو</Button>
            </Link>
          );
        }
      }
      default:
        return (
          <Button
            onClick={() => {
              router.push(`/lesson/${lesson.slug}`);
            }}
          >
            مشاهده کلاس
          </Button>
        );
    }
  };

  return (
    <>
      <NextSeo title={data?.course?.title} />
      مشاهده {data?.course?.title} <Divider />
      {data?.course?.sections.length > 0 ? (
        <Row gutter={[12, 12]}>
          {
            // @ts-ignore
            data?.course?.sections.toReversed().map((section, idx) => {
              if (section.title) {
                return (
                  <Col span={24} key={idx}>
                    <div title={section?.title ?? "-"}>
                      <List
                        header={<div>{section?.title}</div>}
                        bordered
                        dataSource={
                          section.lessons
                            ?.sort(
                              // @ts-ignore
                              ({ order: b }, { order: a }) =>
                                parseInt(b) - parseInt(a)
                            )
                            .toReversed() ?? []
                        }
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
                                {item.lesson.duration && (
                                  <Descriptions.Item label="طول رویداد">
                                    {item.lesson.duration ?? "-"}
                                  </Descriptions.Item>
                                )}
                                <Descriptions.Item label="عمومی">
                                  {item.lesson.public ? (
                                    <Tag color="green">عمپمی</Tag>
                                  ) : (
                                    <Tag color="blue">خصوصی</Tag>
                                  )}
                                </Descriptions.Item>
                                {item.lesson.excerpt && (
                                  <Descriptions.Item label="توضیحات کوتاه">
                                    {item?.lesson?.excerpt &&
                                      parse(item.lesson.excerpt)}
                                  </Descriptions.Item>
                                )}
                              </Descriptions>
                              <Descriptions.Item>
                                {renderButton(item.lesson)}
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
    </>
  );
};

export default Edit;

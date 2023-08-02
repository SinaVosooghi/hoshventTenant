import { EditFilled, StarFilled } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Card, Col, Result, Row, Space } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { siteGetLessonBySlug } from "../../src/shared/apollo/graphql/queries/lesson/siteGetLessonBySlug";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Image from "next/image";
import { checkLogin } from "../../src/util/utils";

require("./style.less");

const Lesson = () => {
  const router = useRouter();
  const { data, loading } = useQuery(siteGetLessonBySlug, {
    notifyOnNetworkStatusChange: true,
    // @ts-ignore
    variables: { slug: router.query.lesson && router.query.lesson[0] },
    fetchPolicy: "network-only",
  });

  const renderVideoOptions = () => {
    switch (data?.lessonApi?.videooptions?.type) {
      case "video":
        return (
          <video
            src={
              process.env.NEXT_PUBLIC_SITE_URL +
              "/video/" +
              data?.lessonApi?.videooptions?.video
            }
            height="500"
            controls
          ></video>
        );
      case "link":
        return (
          <video
            src={data?.lessonApi?.videooptions?.video}
            height="500"
            controls
          ></video>
        );
    }
  };

  return !checkLogin() ? (
    <Result
      status="403"
      title="خطا"
      subTitle="این کلاس بصورت عمومی ارائه نشده است"
      extra={<Button type="primary">بازگشت به صفحه اصلی</Button>}
    />
  ) : (
    <div id="lesson">
      <MainBreadCrumb secondItem="کلاس" activeItem={data?.lessonApi?.title} />
      <Row justify="center" gutter={[20, 20]}>
        <Col md={20} xs={24} id="lesson-container">
          <div>
            <Row gutter={[48, 48]}>
              <Col md={24}>
                <Card
                  className="lesson-info-content lesson-content"
                  bordered={false}
                  loading={loading}
                >
                  <div className="lesson-image">
                    {data?.lessonApi?.image && (
                      <Image
                        alt={data?.lessonApi?.seotitle}
                        src={
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          data?.lessonApi?.image
                        }
                        fill
                        sizes="50vw"
                      />
                    )}
                  </div>
                  <div>
                    <h1>{data?.lessonApi?.title}</h1>
                    <p>{parse(data?.lessonApi?.excerpt ?? "")}</p>
                    {data?.lessonApi?.duration && (
                      <div className="lesson-info-item duration">
                        مدت زمان
                        <span>{data?.lessonApi?.duration}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {data?.lessonApi?.videooptions?.type && (
                  <div className="lesson-description">
                    {renderVideoOptions()}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Col>
        {data?.lessonApi?.body && (
          <Col md={20} xs={24}>
            <div className="lesson-description">
              <div className="description-title">
                <div className="icon">
                  <EditFilled />
                </div>
                <div>
                  <p> توضیحات </p>
                </div>
              </div>
              <div className="desc">
                <div className="pattern">
                  <img src="/assets/shop/pattern.png" alt="slide" />
                </div>
                <div>{parse(data?.lessonApi?.body ?? "")}</div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Lesson;

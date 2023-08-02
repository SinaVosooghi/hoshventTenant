import {
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Row, message, notification } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CategoriesSlider from "../../src/components/categoriesSlider";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { siteGetTeacher } from "../../src/shared/apollo/graphql/queries/user/siteGetTeacher";
import { siteCreateFollow } from "../../src/shared/apollo/graphql/mutations/follow/create";
import { useEffect, useState } from "react";
import { getUserFromCookie } from "../../src/util/utils";
import { User } from "../../src/datamodel";
import { siteCheckFollow } from "../../src/shared/apollo/graphql/queries/follow/siteCheckFollow";
import parse from "html-react-parser";
import CourseSlider from "../../src/components/sections/featured/featured";
import Link from "next/link";
import { NextSeo } from "next-seo";

require("./style.less");

const Teacher = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [followed, setFollowed] = useState(false);

  const { data, loading } = useQuery(siteGetTeacher, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
  });

  const [checkFollow, { loading: checkLoading }] = useLazyQuery(
    siteCheckFollow,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (data.checkFollow) {
          setFollowed(true);
        } else {
          setFollowed(false);
        }
      },
    }
  );

  const [follow, { loading: followLoading }] = useMutation(siteCreateFollow, {
    refetchQueries: [siteGetTeacher, siteCheckFollow],
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (error.message === "Already followed") {
        message.error("قبلا دنبال کرده اید!");
      } else if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "برای دنبال کردن دادن، وارد حساب کاربری شوید",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  const clickFollowHandler = () => {
    follow({
      variables: {
        input: {
          teacher: data?.getTeacher?.id,
        },
      },
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  useEffect(() => {
    if (data?.getTeacher) {
      checkFollow({ variables: { teacher: data?.getTeacher?.id } });
    }
  }, [data?.getTeacher]);

  return (
    <>
      <NextSeo
        title={
          data?.getTeacher?.firstName + " " + data?.getTeacher?.lastName ??
          "استاد"
        }
        description={data?.getTeacher?.about && parse(data?.getTeacher?.about)}
      />
      <div id="teacher">
        <MainBreadCrumb
          secondItem="اساتید"
          activeItem={
            data?.getTeacher?.firstName + " " + data?.getTeacher?.lastName ??
            "استاد"
          }
        />
        <Row justify="center" className="teacher-wrapper">
          <Col md={20} xs={24}>
            <div id="teacher-container">
              <div className="teacher-detail">
                <div className="teacher-info">
                  <Avatar
                    size={100}
                    icon={<UserOutlined rev={undefined} />}
                    src={
                      process.env.NEXT_PUBLIC_SITE_URL +
                      "/" +
                      data?.getTeacher?.avatar
                    }
                  />
                  <div className="teacher-name">
                    {data?.getTeacher?.title && (
                      <span>
                        مکلاس
                        <strong>{data?.getTeacher?.title} </strong>
                      </span>
                    )}

                    <h1>
                      {data?.getTeacher?.firstName}
                      <br />
                      {data?.getTeacher?.lastName}
                    </h1>
                  </div>
                </div>
                <div className="teacher-res">
                  <p>
                    <span>{data?.getTeacher?.follows?.length}</span>
                    دنبال کننده
                  </p>
                  <p>
                    <span>{data?.getTeacher?.attendees?.length}</span>
                    هنرجو
                  </p>
                  <p>
                    <span>{data?.getTeacher?.lessons?.length}</span>
                    کلاس
                  </p>
                  <p>
                    <span>{data?.getTeacher?.courses?.length}</span>
                    دوره
                  </p>
                </div>
              </div>
              <div className="seperator"></div>
              <div className="teacher-social">
                <Button
                  size="large"
                  onClick={clickFollowHandler}
                  loading={followLoading}
                  className={followed ? "disabled" : ""}
                >
                  {followed ? "لغو دنبال کردن" : " دنبال کردن"}
                </Button>
                {data?.getTeacher?.twitter ||
                data?.getTeacher?.linkedin ||
                data?.getTeacher?.instagram ||
                data?.getTeacher?.whatsapp ? (
                  <p>من را در شبکه های اجتماعی دنبال کنید </p>
                ) : (
                  ""
                )}

                <ul>
                  {data?.getTeacher?.twitter && (
                    <li>
                      <Link href={data?.getTeacher?.twitter}>
                        <TwitterOutlined rev={undefined} />
                      </Link>
                    </li>
                  )}

                  {data?.getTeacher?.linkedin && (
                    <li>
                      <Link href={data?.getTeacher?.twitter}>
                        <LinkedinOutlined rev={undefined} />
                      </Link>
                    </li>
                  )}

                  {data?.getTeacher?.instagram && (
                    <li>
                      <Link href={data?.getTeacher?.twitter}>
                        <InstagramOutlined rev={undefined} />
                      </Link>
                    </li>
                  )}

                  {data?.getTeacher?.whatsapp && (
                    <li>
                      <Link href={data?.getTeacher?.twitter}>
                        <WhatsAppOutlined rev={undefined} />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {data?.getTeacher?.about && (
              <div className="teacher-about">
                <h2>درباره من</h2>
                {parse(data?.getTeacher?.about)}
              </div>
            )}
          </Col>
        </Row>
        <CourseSlider
          items={data?.getTeacher?.courses}
          loading={loading}
          title="دوره های"
          subTitle={
            data?.getTeacher?.firstName + " " + data?.getTeacher?.lastName ??
            "استاد"
          }
          hideShowMore
        />
      </div>
    </>
  );
};

export default Teacher;

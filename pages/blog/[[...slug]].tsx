import { DislikeFilled, LikeFilled } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Col, Row, message, notification } from "antd";
import Image from "next/image";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CategoriesSlider from "../../src/components/categoriesSlider";
import { siteGetBlog } from "../../src/shared/apollo/graphql/queries/blog/siteGetBlog";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";
import Review from "../../src/components/review";
import { siteCreateLike } from "../../src/shared/apollo/graphql/mutations/like/create";

require("./style.less");

const Blog = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, loading } = useQuery(siteGetBlog, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: slug && slug[0] },
  });

  const [like, { loading: likeloading }] = useMutation(siteCreateLike, {
    refetchQueries: [siteGetBlog],
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      message.success("رای شما با موفقیت ثبت شد!");
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "برای رای دادن، وارد حساب کاربری شوید",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  const onDislikePressed = () => {
    like({
      variables: {
        input: {
          blog: data?.blogApi?.id,
          like: false,
        },
      },
    });
  };

  const onLikePressed = () => {
    like({
      variables: {
        input: {
          blog: data?.blogApi?.id,
          like: true,
        },
      },
    });
  };

  return (
    <>
      <NextSeo
        title={data?.blogApi?.title}
        description={data?.blogApi?.seobody}
      />
      <div id="blog">
        <MainBreadCrumb
          secondItem="وبلاگ"
          activeItem="دانشکده های موسیقی در ایران"
        />
        <Row justify="center">
          <Col md={20} xs={24} id="blog-container">
            <Fade>
              <div
                className="blog-header"
                style={{
                  backgroundImage: `url('${
                    process.env.NEXT_PUBLIC_SITE_URL + "/" + data?.blogApi.image
                  }')`,
                }}
              >
                <div className="blog-info">
                  <div className="blog-info-item category">
                    <span>دسته بندی ها</span>
                    <p>{data?.blogApi?.category?.title}</p>
                  </div>
                  {data?.blogApi?.readtime && (
                    <div className="blog-info-item">
                      <div className="blog-info-content">
                        <div className="blog-icon">
                          <Image
                            src={"/assets/blog/clock.png"}
                            alt={""}
                            width={33}
                            height={33}
                          />
                        </div>
                        <div>
                          <span>زمان مورد نیاز برای مطالعه </span>
                          <p>{data?.blogApi?.readtime} دقیقه</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="blog-info-item">
                    <div className="blog-info-content">
                      <div className="blog-icon">
                        <Image
                          src={"/assets/blog/user.png"}
                          alt={""}
                          width={26}
                          height={32}
                        />
                      </div>
                      <div>
                        <span>نویسنده</span>
                        <p>
                          {data?.blogApi?.author?.firstName}{" "}
                          {data?.blogApi?.author?.lastName}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="blog-title-container">
                <div className="blog-title">
                  <span>
                    <img
                      src="/assets/latest/musical-note-sharp.png"
                      alt="rasta"
                    />
                  </span>
                  <h1>{data?.blogApi.title}</h1>
                </div>
                <div className="blog-likes">
                  <span className="dislike" onClick={onDislikePressed}>
                    {
                      data?.blogApi?.likes?.filter((i: any) => i.like === false)
                        .length
                    }
                    <DislikeFilled  />
                  </span>
                  <span className="like" onClick={onLikePressed}>
                    {data?.blogApi?.likes?.filter((i: any) => i.like).length}
                    <LikeFilled  />
                  </span>
                </div>
              </div>

              <div className="blog-divider"></div>

              <div className="blog-content">
                {data?.blogApi?.body && parse(data?.blogApi?.body)}
              </div>
            </Fade>
          </Col>
        </Row>
        {/* <CourseSlider /> */}
        <Review
          type="blog"
          itemTitle={data?.blogApi?.title}
          itemId={data?.blogApi?.id}
          hideRating
        />
        <CategoriesSlider />
      </div>
    </>
  );
};

export default Blog;

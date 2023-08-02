import { Button, Col, List, Row, Slider, Space } from "antd";
import Link from "next/link";
// @ts-ignore
import { Fade } from "react-reveal";
import SlideItem from "./slideItem";
import CommentItem from "./Comment";
import CreateComment from "./CreateComment";
import { useEffect, useState } from "react";
import Product from "../../datamodel/Product";
import Course from "../../datamodel/Course";
import Blog from "../../datamodel/Blog";
import Setting from "../../datamodel/Setting";
import useGetSetting from "../../hooks/useGetSetting";
import { siteGetReviews } from "../../shared/apollo/graphql/queries/review/siteGetReviews";
import { useQuery } from "@apollo/client";

require("./style.less");

const Review = ({
  type,
  itemTitle,
  itemId,
  overall,
  answers,
  hideRating,
}: {
  type: "course" | "product" | "blog";
  itemTitle: string;
  itemId: number;
  overall?: number;
  answers?: object;
  hideRating?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { data: reviewsData, loading } = useQuery(siteGetReviews, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: { input: { [type]: itemId, skip: 0 } },
  });

  const renderSliders = () => {
    if (answers) {
      const items = Object.entries(answers).map(([key, value]) => {
        return (
          <SlideItem
            key={key}
            title={key}
            value={value ? parseInt(value) : 0}
          />
        );
      });

      return items;
    }
  };

  const renderType = () => {
    let title;
    switch (type) {
      case "blog":
        title = "مقاله";
        break;
      case "course":
        title = "دوره";
        break;
      case "product":
        title = "محصول";
        break;
    }

    return title;
  };

  return (
    <Fade>
      <p className="reviews-title">نظرات کاربران</p>
      <Row justify="center">
        <Col md={20} xs={24}>
          <div id="review">
            <Row className="review-result" gutter={[70, 70]} align="middle">
              <Col md={6} xs={24}>
                <div className="review-login-status">
                  <p>شما هم می‌توانید در مورد این {renderType()} نظر بدهید</p>
                  <p>
                    برای ثبت نظر، لازم است ابتدا
                    <Link href={"/login"}>وارد حساب کاربری خود شوید</Link>
                  </p>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    type="primary"
                  >
                    افزودن نظر جدید
                  </Button>
                </div>
              </Col>
              {!hideRating && (
                <Col md={18} xs={24}>
                  <div className="review-total">
                    <h6>امتیاز {renderType()}</h6>
                    <p>
                      <strong>{overall ?? 0}</strong>از مجموع{" "}
                      <span>{reviewsData?.reviewsApi?.count ?? 0}</span>امتیاز
                    </p>
                    <Row className="sliders" gutter={[70, 70]}>
                      <Col md={24} xs={24}>
                        <div className="sliders-container">
                          {renderSliders()}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}
            </Row>
            <List
              className="review-comments"
              dataSource={reviewsData?.reviewsApi?.reviews}
              pagination={{
                defaultPageSize: 4,
              }}
              loading={loading}
              renderItem={(item) => (
                <List.Item>
                  <CommentItem review={item} hideRating={hideRating} />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
      <CreateComment
        type={type}
        open={open}
        setClose={() => setOpen(false)}
        itemTitle={itemTitle}
        itemId={itemId}
        hideRating={hideRating}
      />
    </Fade>
  );
};

export default Review;

import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { url } from "inspector";
import Course from "../../../datamodel/Course";
import { percentCalculate } from "../../../util/utils";
import currencyType from "../../currency";

const FeaturedItem = ({ course }: { course: Course }) => {
  return (
    <div className="featured-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + course?.image
          }')`,
        }}
      >
        {course?.duration && (
          <div className="item-duration">
            <ClockCircleOutlined />
            {course?.duration}
          </div>
        )}

        <div className="item-rate">
          4/9
          <StarFilled />
        </div>
      </div>
      <div className="item-content">
        <p className="item-title">{course?.title}</p>
        <span className="divider">
          <div>
            <img src="/assets/icons/music-note.png" alt="rasta" />
          </div>
        </span>
        <span className="item-author">
          {course?.organizer?.firstName} {course?.organizer?.lastName}
        </span>
      </div>
      <div className="item-button">
        <Button>
          {course?.offprice && (
            <p className="item-sale-price">
              {course?.offprice?.toLocaleString()}
            </p>
          )}
          {course?.price && (
            <p className="item-regular-price">
              {course?.price?.toLocaleString()}
            </p>
          )}
          <span className="item-currency">
            {course?.price ? currencyType(): "رایگان"}
          </span>

          {course?.offprice && (
            <span className="item-percentage">
              {percentCalculate(course?.offprice, course?.price)}%
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FeaturedItem;

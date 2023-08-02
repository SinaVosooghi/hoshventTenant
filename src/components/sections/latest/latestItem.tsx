import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import { Button, Divider } from "antd";
import Course from "../../../datamodel/Course";
import { percentCalculate } from "../../../util/utils";
import currencyType from "../../currency";

const LatestItem = ({ course }: { course: Course }) => {
  return (
    <div className="latest-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + course?.image
          }')`,
        }}
      >
        <span className="top-arrow">
          <img src="/assets/latest/musical-note-sharp.png" alt="rasta" />
        </span>
        <div className="item-content">
          <p className="item-title">{course?.title}</p>
          <span className="item-author">
            {course?.organizer?.firstName} {course?.organizer?.lastName}
          </span>
        </div>
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
            {course?.price ? currencyType() : "رایگان"}
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

export default LatestItem;

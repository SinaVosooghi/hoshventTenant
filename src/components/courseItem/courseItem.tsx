import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import { Button } from "antd";
import Course from "../../datamodel/Course";
import { percentCalculate } from "../../util/utils";
import currencyType from "../currency";
require("./style.less");

const CourseItem = ({ item }: { item: Course }) => {
  return (
    <div className="course-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + item?.image
          }')`,
        }}
      >
        {item.duration && (
          <div className="item-duration">
            <ClockCircleOutlined rev={undefined} />
            {item.duration}
          </div>
        )}

        {item.reviews.length ? (
          <div className="item-rate">
            {item.reviews.length}
            <StarFilled rev={undefined} />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="item-content">
        <p className="item-title">{item.title}</p>
        <span className="divider">
          <div>
            <img src="/assets/icons/music-note.png" alt="rasta" />
          </div>
        </span>
        <span className="item-author">
          {item.organizer?.firstName} {item.organizer?.lastName}
        </span>
      </div>
      <div className="item-button">
        <Button>
          {item.offprice ? (
            <p className="item-sale-price">{item.offprice?.toLocaleString()}</p>
          ) : (
            ""
          )}
          <p className="item-regular-price">
            {item.price?.toLocaleString() ?? "رایگان"}
            {item.price && (
              <span className="item-currency">{currencyType()} </span>
            )}
          </p>

          {item.offprice && (
            <span className="item-percentage">
              {percentCalculate(item.offprice, item.price)}%
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseItem;

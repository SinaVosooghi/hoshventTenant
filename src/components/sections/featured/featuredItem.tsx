import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import currencyType from "../../currency";
import Event from "../../../datamodel/Event";
import moment from "jalali-moment";

const FeaturedItem = ({ event }: { event: Event }) => {
  return (
    <div className="featured-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + event?.image
          }')`,
        }}
      >
        {event?.duration && (
          <div className="item-duration">
            <ClockCircleOutlined rev={undefined} />
            {event?.duration}
          </div>
        )}
      </div>
      <div className="item-content">
        <p className="item-title">{event?.title}</p>
        <span className="divider">
          <div className="blue-seperator"></div>
        </span>
        <div className="item-information">
          <span className="item-author">
            {event?.user?.firstName} {event?.user?.lastName}
          </span>

          <span>
            {event.start_date &&
              moment(event.start_date).locale("fa").format("L")}
          </span>
        </div>
      </div>
      {event?.offprice ||
        (event?.price && (
          <div className="item-button">
            <Button>
              {event?.offprice && (
                <p className="item-sale-price">
                  {event?.offprice?.toLocaleString()}
                </p>
              )}
              {event?.price && (
                <p className="item-regular-price">
                  {event?.price?.toLocaleString()}
                </p>
              )}
              <span className="item-currency">
                {event?.price ? currencyType() : "رایگان"}
              </span>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default FeaturedItem;

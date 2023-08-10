import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "jalali-moment";
import Workshop from "../../datamodel/Workshop";
import currencyType from "../currency";

const WorkshopItem = ({ workshop }: { workshop: Workshop }) => {
  return (
    <div className="featured-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + workshop?.image
          }')`,
        }}
      >
        {workshop.start_date && (
          <div className="item-duration">
            <ClockCircleOutlined rev={undefined} />
            {moment(workshop.start_date).locale("fa").format("H:mm")}
          </div>
        )}
      </div>
      <div className="item-content">
        <p className="item-title">{workshop?.title}</p>
        <span className="divider">
          <div className="blue-seperator"></div>
        </span>
        <div className="item-information">
          <span className="item-author">{workshop?.hall?.title}</span>

          <span>
            {workshop?.start_date &&
              moment(workshop.start_date).locale("fa").format("L")}
          </span>
        </div>
      </div>
      {workshop?.price && (
        <div className="item-button">
          <Button>
            {workshop?.price && (
              <p className="item-regular-price">
                {workshop?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {workshop?.price ? currencyType() : "رایگان"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkshopItem;

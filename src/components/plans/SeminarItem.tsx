import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "jalali-moment";
import Workshop from "../../datamodel/Workshop";
import currencyType from "../currency";

const SeminarItem = ({ seminar }: { seminar: Workshop }) => {
  return (
    <div className="featured-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + seminar?.image
          }')`,
        }}
      >
        {seminar.capacity && (
          <div className="item-duration">
            <UserOutlined rev={undefined} />
            {seminar.capacity}
          </div>
        )}
      </div>
      <div className="item-content">
        <p className="item-title">{seminar?.title}</p>
        <span className="divider">
          <div className="blue-seperator"></div>
        </span>
        <div className="item-information">
          <span className="item-author">{seminar?.hall?.title}</span>
          <span>
            {seminar?.start_date &&
              moment(seminar.start_date).locale("fa").format("L")}
          </span>{" "}
        </div>
      </div>
      {seminar?.price && (
        <div className="item-button">
          <Button>
            {seminar?.price && (
              <p className="item-regular-price">
                {seminar?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {seminar?.price ? currencyType() : "رایگان"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeminarItem;

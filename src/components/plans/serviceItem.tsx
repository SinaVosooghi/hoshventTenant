import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "jalali-moment";
import Workshop from "../../datamodel/Workshop";
import currencyType from "../currency";
import Service from "../../datamodel/Service";

const ServiceItem = ({ service }: { service: Service }) => {
  return (
    <div className="featured-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + service?.image
          }')`,
        }}
      >
        {service.start_date && (
          <div className="item-duration">
            <ClockCircleOutlined rev={undefined} />
            {moment(service.start_date).locale("fa").format("H:mm")}
          </div>
        )}
      </div>
      <div className="item-content">
        <p className="item-title">{service?.title}</p>
        <span className="divider">
          <div className="blue-seperator"></div>
        </span>
        <div className="item-information">
          <span>
            {service?.start_date &&
              "تاریخ شروع: ‌" +
                moment(service.start_date).locale("fa").format("L")}
          </span>
        </div>
      </div>
      {service?.price && (
        <div className="item-button">
          <Button>
            {service?.price && (
              <p className="item-regular-price">
                {service?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {service?.price ? currencyType() : "رایگان"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;

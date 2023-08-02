import { Button } from "antd";
import currencyType from "../currency";
import parse from "html-react-parser";
import Link from "next/link";
import Service from "../../datamodel/Service";

const ServiecItem = ({ service }: { service: Service }) => {
  return (
    <div className="featured-slider-item">
      <div className="item-content">
        <p className="item-title">{service?.title}</p>
      </div>
      {service?.price ? (
        <div className="item-button">
          <div className="item-price">
            {service?.price && (
              <p className="item-regular-price">
                {service?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {service?.price ? currencyType() : "رایگان"}
            </span>
          </div>
        </div>
      ) : (
        <div className="item-button">
          <div className="item-price">
            <p className="item-regular-price">رایگان</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiecItem;

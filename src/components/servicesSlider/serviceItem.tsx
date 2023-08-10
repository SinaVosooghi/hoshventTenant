import { Button } from "antd";
import currencyType from "../currency";
import parse from "html-react-parser";
import Link from "next/link";
import Service from "../../datamodel/Service";
import Workshop from "../../datamodel/Workshop";

const SeminarItem = ({ workshop }: { workshop: Workshop }) => {
  return (
    <div className="featured-slider-item">
      <div className="item-content">
        <p className="item-title">{workshop?.title}</p>
      </div>
      {workshop?.price ? (
        <div className="item-button">
          <div className="item-price">
            {workshop?.price && (
              <p className="item-regular-price">
                {workshop?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {workshop?.price ? currencyType() : "رایگان"}
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

export default SeminarItem;

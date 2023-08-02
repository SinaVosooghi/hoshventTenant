import { Button, Col } from "antd";
import moment from "jalali-moment";
import Plan from "../../datamodel/Plan";
import currencyType from "../currency";
import parse from "html-react-parser";
import Link from "next/link";

const PlanItem = ({ plan }: { plan: Plan }) => {
  return (
    <Col md={6} xs={24} className="featured-slider-item">
      <div className="item-content">
        <p className="item-title">{plan?.title}</p>
        <span className="type-pill">امکانات پایه</span>
        <div className="item-information">
          {plan?.services?.length ? (
            <ul>
              {plan?.services?.slice(0, 3)?.map((service, index) => {
                return <li key={service.id}>{service.title}</li>;
              })}
              {plan?.services.length > 4 && <li>...</li>}
            </ul>
          ) : (
            <></>
          )}
        </div>
      </div>
      {plan?.price ? (
        <div className="item-button">
          <div className="item-price">
            {plan?.price && (
              <p className="item-regular-price">
                {plan?.price?.toLocaleString()}
              </p>
            )}
            <span className="item-currency">
              {plan?.price ? currencyType() : "رایگان"}
            </span>
          </div>
          <Link href={`/plan/${plan.slug}`}>
            <Button>اطلاعات بیشتر</Button>
          </Link>
        </div>
      ) : (
        <div className="item-button">
          <div className="item-price">
            <p className="item-regular-price">رایگان</p>
          </div>
          <Link href={`/plan/${plan.slug}`}>
            <Button>اطلاعات بیشتر</Button>
          </Link>
        </div>
      )}
    </Col>
  );
};

export default PlanItem;

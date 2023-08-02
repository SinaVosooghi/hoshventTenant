import { Button, Typography } from "antd";
import Product from "../../../datamodel/Product";
import { percentCalculate } from "../../../util/utils";
import currencyType from "../../currency";
require("../products/style.less");

const { Paragraph, Text } = Typography;

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <div className="product-slider-item">
      <div className="item-image">
        {product.image && (
          <img
            src={process.env.NEXT_PUBLIC_SITE_URL + "/" + product?.image[0]}
            alt="rasta"
            width={"100%"}
          />
        )}
      </div>

      <div className="item-content">
        <Paragraph className="item-title" ellipsis={{ rows: 1 }}>
          {product?.title}
        </Paragraph>
      </div>

      <div className="item-button">
        <div>
          {product.offprice && (
            <span className="item-percentage">
              {percentCalculate(product.offprice, product.price)}%
            </span>
          )}
          {product.offprice && (
            <p className="item-sale-price">
              {product.offprice?.toLocaleString()}
            </p>
          )}
        </div>
        <div className="product-price">
          <p className="item-regular-price">
            {product.price?.toLocaleString()}
          </p>
          <span className="item-currency">
            {product.price ? currencyType() : "بدون قیمت"}
          </span>
        </div>
        <Button size="large">مشاهده محصول</Button>
      </div>
    </div>
  );
};

export default ProductItem;

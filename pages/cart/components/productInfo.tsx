import { Button, Image, Tag } from "antd";
import { percentCalculate } from "../../../src/util/utils";
import Product from "../../../src/datamodel/Product";
import { Dispatch } from "../../../src/shared/store";
import { useDispatch } from "react-redux";
import currencyType from "../../../src/components/currency";

const ProductCheckoutInfo = ({ product }: { product: Product | null }) => {
  const dispatch = useDispatch<Dispatch>();

  return (
    <div className="product-checkout-info">
      <div className="product-image">
        {product?.image && (
          <Image
            src={
              product?.image
                ? process.env.NEXT_PUBLIC_SITE_URL + "/" + product?.image
                : "https://fakeimg.pl/600x400?text=رویداد"
            }
            style={{ borderRadius: 20 }}
            alt="rasta"
            width={240}
            preview={false}
          />
        )}
      </div>
      <div className="product-detail">
        <div className="product-checkout-title">
          <h1>{product?.title ?? product?.label}</h1>
          {product?.type ||
            (product?.__typename === "Service" && <Tag>خدمات </Tag>)}
          {product?.type === "Seminar" && <Tag>{"رویداد جانبی"} </Tag>}
          {product?.type === "Workshop" && <Tag> ورکشاپ</Tag>}
        </div>
        <div className="product-divider"></div>

        <div className="product-details">
          <div className="item-button">
            <Button>
              {product?.offprice && (
                <p className="item-sale-price">
                  {product?.offprice?.toLocaleString()}
                </p>
              )}
              <p className="item-regular-price">
                {product?.price?.toLocaleString() ?? "رایگان"}
              </p>
              {product?.price && (
                <span className="item-currency">{currencyType()}</span>
              )}
              {product?.offprice && (
                <span className="item-percentage">
                  {percentCalculate(product?.offprice, product?.price)}%
                </span>
              )}
            </Button>
          </div>
          <span
            className="remove-item"
            onClick={() => dispatch.cart.removeCart(product)}
          >
            حذف
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckoutInfo;

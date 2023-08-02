import { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Image } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import Product from "../../datamodel/Product";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "../../shared/store";
import currencyType from "../currency";

const CartItem = ({ product }: { product: Product }) => {
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [count, setCount] = useState(product.qty ?? 1);
  const dispatch = useDispatch<Dispatch>();

  const increase = () => {
    setCount(count + 1);
    dispatch.cart.addQuantity(product);
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      newCount = 0;
    }
    dispatch.cart.subQuantity(product);
    setCount(newCount);
  };

  const removeItem = () => {
    dispatch.cart.removeCart(product);
  };

  useEffect(() => {
    setCount(product.qty);
  }, [cartItems]);

  return (
    <div className="cart-item">
      <span onClick={() => removeItem()} className="remove-item">
        حذف
      </span>
      <Image
        src={process.env.NEXT_PUBLIC_SITE_URL + "/" + product?.image}
        alt="rasta"
        width={110}
        preview={false}
      />
      <div className="cart-item-content">
        <p className="product-title">{product.title}</p>
        <div className="product-quantity">
          <div>
            <MinusOutlined onClick={decline} />
            <Badge count={count}></Badge>
            <PlusOutlined onClick={increase} />
          </div>
        </div>

        <div className="product-price">
          {product.offprice && (
            <p className="sale">{product.offprice.toLocaleString()}</p>
          )}

          {product.price ? (
            <>
              <p className="price">{product.price?.toLocaleString()}</p>
              <span>{currencyType()}</span>
            </>
          ) : (
            <span>رایگان</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;

import { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "../../shared/store";
import currencyType from "../currency";
import Event from "../../datamodel/Event";

const CartItem = ({ event }: { event: Event }) => {
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [count, setCount] = useState(event.qty ?? 1);
  const dispatch = useDispatch<Dispatch>();

  const increase = () => {
    setCount(count + 1);
    dispatch.cart.addQuantity(event);
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      newCount = 0;
    }
    dispatch.cart.subQuantity(event);
    setCount(newCount);
  };

  const removeItem = () => {
    dispatch.cart.removeCart(event);
  };

  useEffect(() => {
    //@ts-ignore
    setCount(event.qty);
  }, [cartItems, event.qty]);

  return (
    <div className="cart-item">
      <span onClick={() => removeItem()} className="remove-item">
        حذف
      </span>

      <Image
        src={
          event?.image
            ? process.env.NEXT_PUBLIC_SITE_URL + "/" + event?.image
            : "https://fakeimg.pl/600x400?text=رویداد"
        }
        alt="rasta"
        width={110}
        preview={false}
      />

      <div className="cart-item-content">
        <p className="event-title">{event.title}</p>

        <div className="event-price">
          {event.offprice && (
            <p className="sale">{event.offprice.toLocaleString()}</p>
          )}

          {event.price ? (
            <>
              <p className="price">{event.price?.toLocaleString()}</p>
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

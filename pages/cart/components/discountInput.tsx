import { useLazyQuery } from "@apollo/client";
import { Button, Input, notification } from "antd";
import { useState, memo } from "react";
import { siteGetCoupon } from "../../../src/shared/apollo/graphql/queries/coupon/siteGetCoupon";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../src/shared/store";
import { CloseOutlined } from "@ant-design/icons";

const DiscountInput = ({ count }: { count?: number }) => {
  const dispatch = useDispatch<Dispatch>();
  const { discount } = useSelector((state: RootState) => state.cart);

  const [code, setCode] = useState("");

  const [getCoupon, { data: couponApi, loading }] = useLazyQuery(
    siteGetCoupon,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: ({ couponApi }) => {
        dispatch.cart.addDiscount({
          code: couponApi.code,
          percent: couponApi.percent,
          id: couponApi.id,
          title: couponApi.title,
        });
      },
      onError: (error) => {
        if (error.message === "Wrong code") {
          notification.warning({
            message: "خطا",
            description: "کد وارد شده اشتباه است!",
          });
        } else if (error.message === "Used code") {
          notification.warning({
            message: "خطا",
            description: "شما قبلا از این کد استفاده کرده اید!",
          });
        } else if (error.message === "Out of limit") {
          notification.warning({
            message: "خطا",
            description: "محدودیت استفاده از این تخفیف به پایان رسیده است!",
          });
        } else {
          notification.error({ message: "خطا در دریافت " });
        }
      },
    }
  );

  const submitCode = () => {
    getCoupon({
      variables: {
        input: {
          code,
          type: "shop",
        },
      },
    });
  };

  const removeCode = () => {
    dispatch.cart.removeDiscount();
  };
  return (
    <div className="discount-box">
      <div className="number-of-items">
        <p>تعداد محصولات سبد خرید:</p>
        <span>
          <strong>{count} </strong> محصول
        </span>
      </div>
      <div className="discount-form ">
        <Input
          placeholder="کد تخفیف"
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          onClick={submitCode}
          loading={loading}
          disabled={!!discount?.id}
        >
          اعمال کد تخفیف
        </Button>
      </div>
      {discount && (
        <div className="selected-discount">
          <p>
            {discount?.title} ({discount?.percent}%)
          </p>
          <CloseOutlined onClick={removeCode} rev={undefined}/>
        </div>
      )}
    </div>
  );
};

export default DiscountInput;

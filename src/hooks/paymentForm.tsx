import React, { useState } from "react";
import { Button } from "antd";
import useCoursePaymentForm from "./usePayment";
import { InfoCircleOutlined } from "@ant-design/icons";
import usePayment from "./usePayment";

const PaymentForm = ({
  itemId,
  total,
  setLoading,
  loading,
  items,
  type,
}: {
  setLoading?: any;
  loading?: boolean;
  itemId?: number;
  total: number;
  items?: any[];
  type: "event" | "shop";
}) => {
  const { handleSubmit } = usePayment({
    itemId,
    total,
    setLoading,
    items,
    type,
  });

  return (
    <div className="stripe-card-wrapper">
      <form onSubmit={handleSubmit}>
        <Button
          block
          className={`buy-btn`}
          htmlType="submit"
          loading={loading}
        >
          تایید و پرداخت
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;

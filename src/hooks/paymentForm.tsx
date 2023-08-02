import React, { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Button } from "antd";
import useCoursePaymentForm from "./useCourseSubmitPayment";
import { InfoCircleOutlined } from "@ant-design/icons";

const PaymentForm = ({
  courseId,
  total,
  setLoading,
  loading,
  items,
  type,
}: {
  setLoading: any;
  loading: boolean;
  courseId?: number;
  total: number;
  items?: any[];
  type: "course" | "shop";
}) => {
  const [disabled, setDisabled] = useState(true);
  const { handleSubmit } = useCoursePaymentForm({
    courseId: courseId,
    total,
    setLoading,
    items,
    type,
  });

  return (
    <div className="stripe-card-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="stripe-card-element">
          <p>
            <InfoCircleOutlined rev={undefined} />
            اطلاعات کارت
          </p>
          <CardElement
            onChange={(e) => {
              if (e.error) setDisabled(true);
              if (e.complete && !e.error) {
                setDisabled(false);
              }
            }}
          />
        </div>
        <Button
          block
          className={`buy-btn`}
          disabled={disabled}
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

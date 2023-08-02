import { Button, Input } from "antd";

const DiscountInput = () => {
  return (
    <div className="discount-box">
      <Input placeholder="کد تخفیف" />
      <Button>اعمال کد تخفیف</Button>
    </div>
  );
};

export default DiscountInput;

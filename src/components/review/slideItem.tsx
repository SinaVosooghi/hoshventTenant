import { Slider } from "antd";

const SlideItem = ({ title, value = 0 }: { title: string; value?: number }) => {
  return (
    <div className="slider-item">
      <p>{title}</p>
      <div className="slider-wrapper">
        <Slider defaultValue={value} min={1} max={5} disabled />
      </div>
    </div>
  );
};

export default SlideItem;

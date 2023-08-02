import { Slider, Space } from "antd";

const ActiveSlideItem = () => {
  return (
    <div className="active-slider-item">
      <p>کیفیت</p>
      <div className="slide-handler">
        <Slider
          defaultValue={5}
          min={1}
          max={5}
          dots
          tooltip={{ formatter: null }}
        />
      </div>
    </div>
  );
};

export default ActiveSlideItem;

import { Checkbox, Radio, Switch } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import Category from "../../src/datamodel/Category";
import "./style.less";

const Sidebar = ({
  setPriceType,
  priceType,
  featured,
  setFeatured,
  onStatusChange,
}: any) => {
  const onChange = (e: CheckboxChangeEvent) => {
    setPriceType(e.target.value);
  };

  const onChangeFeatured = (e: CheckboxChangeEvent) => {
    setFeatured(e.target.value);
  };

  const handleOnStatusChange = (checked: boolean) => {
    onStatusChange(checked);
  };

  return (
    <div id="sidebar">
      <div className="sidebar-item">
        <div className="sidebar-title">
          <p>نوع </p>
        </div>
        <div className="sidebar-content">
          <Radio.Group
            onChange={onChange}
            value={priceType}
            size="large"
            defaultValue={"all"}
          >
            <ul>
              <li>
                <Radio value={"all"}>همه </Radio>
              </li>
              <li>
                <Radio value={"free"}>رایگان </Radio>
              </li>
              <li>
                <Radio value={"cash"}> فقط نقدی </Radio>
              </li>
            </ul>
          </Radio.Group>
        </div>
      </div>

      <div className="sidebar-item">
        <div className="sidebar-title">
          <p>ویژه ها</p>
        </div>
        <div className="sidebar-content">
          <Radio.Group
            onChange={onChangeFeatured}
            value={featured}
            size="large"
            defaultValue={"all"}
          >
            <ul>
              <li>
                <Radio value={"all"}>همه </Radio>
              </li>
              <li>
                <Radio value={true}>ویژه ها </Radio>
              </li>
              <li>
                <Radio value={false}> غیر ویژه ها</Radio>
              </li>
            </ul>
          </Radio.Group>
        </div>
      </div>

      <div className="sidebar-available-items">
        <div>
          <Switch defaultChecked onChange={handleOnStatusChange} />
          <p>فقط موارد فعال</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

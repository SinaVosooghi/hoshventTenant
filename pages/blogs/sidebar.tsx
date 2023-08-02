import { Radio } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import Category from "../../src/datamodel/Category";
import "./style.less";

const Sidebar = ({
  categories,
  category,
  setCategory,
  featured,
  setFeatured,
  setSelectedCategory,
}: any) => {
  const onChangeCategory = (slug: string, title: string | null) => {
    setCategory(slug);
    setSelectedCategory(title);
  };

  const onChangeFeatured = (e: CheckboxChangeEvent) => {
    setFeatured(e.target.value);
  };

  return (
    <div id="sidebar">
      <div className="sidebar-item">
        <div className="sidebar-title">
          <p>دسته بندی ها</p>
        </div>
        <div className="sidebar-content">
          <Radio.Group value={category} size="large" defaultValue={"all"}>
            <ul>
              <li>
                <Radio
                  value={"all"}
                  onClick={() => {
                    onChangeCategory("all", null);
                  }}
                >
                  همه{" "}
                </Radio>
              </li>
              {categories?.map((category: Category) => (
                <li key={category.id}>
                  <Radio
                    value={category.slug}
                    onClick={() => {
                      onChangeCategory(category.slug, category.title);
                    }}
                  >
                    {category.title}
                  </Radio>
                </li>
              ))}
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
    </div>
  );
};

export default Sidebar;

import { Card, Tabs, TabsProps } from "antd";

import GeneralSetting from "./general";
import SecuritySetting from "./security";
import SocialSetting from "./social";

const Settings = () => {
  const items: TabsProps["items"] = [
    {
      key: "general",
      label: `عمومی`,
      children: <GeneralSetting />,
    },
  ];

  return (
    <Card title="تنظیمات">
      <Tabs defaultActiveKey="general" items={items} />
    </Card>
  );
};

export default Settings;

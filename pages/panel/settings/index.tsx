import { Card, Tabs, TabsProps } from "antd";

import GeneralSetting from "./general";
import SecuritySetting from "./security";

const Settings = () => {
  const items: TabsProps["items"] = [
    {
      key: "general",
      label: `عمومی`,
      children: <GeneralSetting />,
    },
    {
      key: "security",
      label: `امنیتی`,
      children: <SecuritySetting />,
    },
  ];

  return (
    <Card title="تنظیمات">
      <Tabs defaultActiveKey="general" items={items} />
    </Card>
  );
};

export default Settings;

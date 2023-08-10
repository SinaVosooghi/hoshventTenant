import {
  AppstoreFilled,
  BookOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MessageOutlined,
  PlusOutlined,
  ReadOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Layout,
  Menu,
  MenuProps,
  notification,
  Result,
  Row,
} from "antd";
import { useRouter } from "next/dist/client/router";
import MainBreadCrumb from "../../components/breadcrumb";
import MainFooter from "../../components/footer";
import MainHeader from "../../components/header";
import { getUserFromCookie, handleLogout } from "../../util/utils";
import { User } from "../../datamodel";
import Link from "next/link";

require("./style.less");

const { Content, Footer } = Layout;

const TeacherLaout = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  type MenuItem = Required<MenuProps>["items"][number];
  const router = useRouter();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group",
    danger?: boolean,
    disabled?: boolean
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
      danger,
      disabled,
    } as MenuItem;
  }

  useMemo(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const items: MenuItem[] = [
    getItem("داشبورد", "/dashboard", <DashboardOutlined rev={undefined} />),
    getItem("رویداد ها", "events", <ReadOutlined rev={undefined} />, [
      getItem(
        "لیست رویداد ها",
        "/dashboard/events",
        <UnorderedListOutlined rev={undefined} />
      ),
    ]),

    getItem(
      "مراجعه کنندگان",
      "/dashboard/attendees",
      <UserOutlined rev={undefined} />,
      undefined,
      undefined,
      false
    ),
    getItem(
      "پیام ها",
      "/dashboard/chats",
      <MessageOutlined rev={undefined} />,
      undefined,
      undefined,
      false
    ),
    getItem(
      "مالی",
      "/dashboard/payments",
      <DollarOutlined rev={undefined} />,
      undefined,
      undefined,
      false,
      false
    ),

    getItem(
      "تنظیمات",
      "/dashboard/settings",
      <SettingOutlined rev={undefined} />,
      undefined,
      undefined,
      false
    ),
    getItem(
      "خروج از حساب کاربری",
      "signout",
      <LogoutOutlined rev={undefined} />,
      undefined,
      undefined,
      true
    ),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "signout") {
      handleLogout();
      notification.success({ message: "شما از حساب کاربری خارج شدید!" });
      router.push("/");
    } else {
      router.push(e.key);
    }
  };

  return (
    <Layout>
      {router.pathname !== "/dashboard/conference/[[...slug]]" ? (
        <>
          <MainHeader />
          <MainBreadCrumb />
          {user?.type === "instructor" ? (
            <Content>
              <Drawer
                placement="right"
                onClose={onClose}
                className="nav-panel-drawer"
                open={open}
                width={260}
              >
                <Menu
                  className="dashboard-menu"
                  onClick={onClick}
                  style={{ width: 256 }}
                  mode="inline"
                  items={items}
                  triggerSubMenuAction="click"
                />
              </Drawer>
              <Row justify="center">
                <Col md={20} xs={24}>
                  <Row id="teacher-dashboard">
                    <Col xs={24} lg={0} md={0}>
                      <AppstoreFilled
                        className="panel-nav-icon"
                        onClick={() => showDrawer()}
                        rev={undefined}
                      />
                    </Col>
                    <Col md={5} xs={0}>
                      <Menu
                        className="dashboard-menu"
                        onClick={onClick}
                        style={{ width: 256 }}
                        mode="inline"
                        items={items}
                        triggerSubMenuAction="click"
                      />
                    </Col>
                    <Col md={19} xs={24}>
                      {children}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Content>
          ) : (
            <Result
              status="403"
              title="خطا"
              subTitle="شما اجازه دسترسی به این صفحه را ندارید!"
              extra={
                <Button type="primary">
                  <Link href="/">بازگشت به صفحه اصلی</Link>
                </Button>
              }
            />
          )}
          <Footer>
            <MainFooter />
          </Footer>
        </>
      ) : (
        <Col md={19}>{children}</Col>
      )}
    </Layout>
  );
};

export default TeacherLaout;

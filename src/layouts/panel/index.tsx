import {
  AppstoreFilled,
  BookOutlined,
  DashboardOutlined,
  DollarOutlined,
  HeartOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
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
import { siteGetUser } from "../../../src/shared/apollo/graphql/queries/user/siteGetUser";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState, useMemo } from "react";
import { User } from "../../datamodel";
import { getCookie, removeCookies } from "cookies-next";
// @ts-ignore
import { Fade } from "react-reveal";
import { NextSeo } from "next-seo";
import Link from "next/link";

require("./style.less");

const { Content, Footer } = Layout;

const PanelLayout = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  type MenuItem = Required<MenuProps>["items"][number];
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useMemo(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const router = useRouter();

  const [getUser] = useLazyQuery(siteGetUser, {
    fetchPolicy: "network-only",
    onError: (err) => {
      if (err.message === "Unauthorized") {
        removeCookies("user");
        notification.success({ message: "شما از حساب کاربری خارج شدید!" });
        router.push("/login");
      }
    },
  });

  useEffect(() => {
    let userCookie: User | null = null;
    if (getCookie("user")) {
      // @ts-ignore
      userCookie = JSON.parse(getCookie("user"));
      getUser({
        variables: {
          // @ts-ignore
          id: parseInt(userCookie?.uid),
        },
      });
    } else {
      router.push("/login");
    }
  }, []);

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

  const items: MenuItem[] = [
    getItem("داشبورد", "/panel", <DashboardOutlined rev={undefined} />),
    getItem("رویداد های من", "/panel/events", <BookOutlined rev={undefined} />),
    getItem(
      "پیام ها",
      "/panel/chats",
      <MessageOutlined rev={undefined} />,
      undefined,
      undefined,
      false
    ),
    getItem(
      "مالی",
      "/panel/payments",
      <DollarOutlined rev={undefined} />,
      undefined,
      undefined,
      false,
      false
    ),
    getItem(
      "تنظیمات",
      "/panel/settings",
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
      {router.pathname !== "/panel/conference/[[...slug]]" ? (
        <>
          <NextSeo title="پنل کاربری" noindex />
          <MainHeader />
          <MainBreadCrumb />
          {user?.type === "user" ? (
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
                    <Col xs={24}>
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
                        style={{ width: 265 }}
                        mode="inline"
                        items={items}
                        triggerSubMenuAction="click"
                      />
                    </Col>
                    <Col md={19}>
                      <Fade>{children}</Fade>
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

export default PanelLayout;

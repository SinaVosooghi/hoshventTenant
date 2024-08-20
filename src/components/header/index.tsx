/* eslint-disable react/jsx-no-undef */
import { Button, Col, Drawer, Dropdown, Empty, Flex, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../shared/store";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import CartItem from "./cartItem";
import currencyType from "../currency";
import { Key, memo, useEffect, useState } from "react";
import { User } from "../../datamodel";
import { getUserFromCookie } from "../../util/utils";
import StudentDropdown from "../breadcrumb/studentDropdown";
import TeacherDropdown from "../breadcrumb/teacherDropdown";
import useGetSetting from "../../hooks/useGetSetting";
import Event from "../../datamodel/Event";
import { siteGetMenus } from "../../shared/apollo/graphql/queries/menu/siteGetMenus";
import { useQuery } from "@apollo/client";
import { UrlObject } from "url";

const MainHeader = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>();
  const { data } = useGetSetting();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const { data: menus } = useQuery(siteGetMenus, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 14,
        skip: 0,
        status: true,
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const total = () => {
    let total = 0;
    total = Math.ceil(
      cartItems
        ?.map((item: any) => item?.price * item.qty)
        .reduce((prev: any, curr: any) => prev + curr, 0)
    );

    return total;
  };

  return (
    <>
      <Drawer
        placement="right"
        onClose={onClose}
        className="nav-drawer"
        open={open}
        width={260}
        footer={
          <Link href={"/cart"} id="cart">
            <Image
              src="/assets/icons/cart.png"
              height={26}
              width={26}
              alt="cart"
            />
            <span>{cartItems?.length ?? 0}</span>
          </Link>
        }
      >
        <ul id="drawer-list">
          <li
            className={router.asPath === "/" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            <Link href={"/"}>صفحه اصلی</Link>
          </li>
          <li
            className={
              router.asPath === "/workshops/" ||
              router.route === "/workshops/[[...workshop]]"
                ? "active"
                : ""
            }
            onClick={() => setOpen(false)}
          >
            <Link href={"/workshops"}>ورکشاپ ها</Link>
          </li>
          <li
            onClick={() => setOpen(false)}
            className={
              router.asPath === "/seminars/" ||
              router.route === "/seminars/[[...seminar]]"
                ? "active"
                : ""
            }
          >
            <Link href={"/seminars"}>سمینار ها</Link>
          </li>

          <li
            onClick={() => setOpen(false)}
            className={
              router.asPath === "/services/" ||
              router.route === "/services/[[...service]]"
                ? "active"
                : ""
            }
          >
            <Link href={"/services"}>خدمات</Link>
          </li>

          {menus &&
            menus.menusApi?.menus?.map(
              (m: {
                id: Key | null | undefined;
                link: string | UrlObject;
                title: string;
              }) => {
                return (
                  <li
                    onClick={() => setOpen(false)}
                    key={m.id}
                    className={router.asPath === m.link ? "active" : ""}
                  >
                    <Link href={m.link}>{m.title}</Link>
                  </li>
                );
              }
            )}
          <li
            className={router.asPath === "/contact/" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            <Link href={"/contact"}> تماس با ما</Link>
          </li>
        </ul>
      </Drawer>
      <div
        id="nav-drawer"
        className={router.asPath !== "/" ? "dark-navbar" : ""}
      >
        <MenuOutlined onClick={showDrawer} rev={undefined} />

        <Link href={"/"}>
          <div id="logo">
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_URL + "/" + data?.logo}`}
              className="compare-thumbnail"
              height={55}
              alt={"Logo"}
            />
          </div>
        </Link>

        <div id="account">
          {user?.type === "user" && <StudentDropdown user={user} />}
          {user?.type === "instructor" && <TeacherDropdown user={user} />}

          {!user && (
            <Link href={"/login"} onClick={() => setOpen(false)}>
              <Button className={/\/panel/.test(router.asPath) ? "blue" : ""}>
                <Image
                  src="/assets/icons/profile.png"
                  height={20}
                  width={15}
                  alt="profile"
                />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div id="header" className={router.asPath !== "/" ? "silver" : ""}>
        <Row justify="center">
          <Col md={20} xs={23}>
            <div className="header-content">
              <div id="header-main">
                <Link href={"/"}>
                  <div id="logo">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_SITE_URL + "/" + data?.logo
                      }`}
                      className="compare-thumbnail"
                      height={55}
                      alt={"Logo"}
                    />
                  </div>
                </Link>

                <div id="account">
                  <div className="header-phone">
                    {data?.phonenumber && (
                      <div className="button-content">
                        <p>
                          <strong>{data?.phonenumber}</strong>
                        </p>
                        پشتیبانی سریع{" "}
                      </div>
                    )}

                    <Link href={"/contact"}>
                      <Image
                        src="/assets/icons/phone-call.png"
                        height={20}
                        width={20}
                        alt="search"
                      />
                    </Link>
                  </div>

                  {user?.type.trim() === "user" && (
                    <StudentDropdown user={user} />
                  )}
                  {user?.type.trim() === "instructor" && (
                    <TeacherDropdown user={user} />
                  )}

                  {!user && (
                    <Link href={"/login"}>
                      <Button
                        className={/\/panel/.test(router.asPath) ? "blue" : ""}
                      >
                        <Image
                          src="/assets/icons/profile.png"
                          height={20}
                          width={15}
                          alt="profile"
                        />
                        ثبت نام / ورود
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <Dropdown
                trigger={["hover"]}
                placement="bottomLeft"
                overlayClassName="cart-dropdown"
                dropdownRender={(menu) => (
                  <div className="cart-content">
                    {cartItems && cartItems?.length > 0 ? (
                      <>
                        <div className="cart-top-area">
                          <span className="cart-count">
                            <strong>{cartItems?.length}</strong> رویداد
                          </span>
                          <Link href={"/cart"}>
                            مشاهده سبد خرید{" "}
                            <ArrowLeftOutlined rev={undefined} />
                          </Link>
                        </div>

                        {
                          // @ts-ignore
                          cartItems.map((item: Event) => (
                            <span key={item.id}>
                              <CartItem event={item} />
                            </span>
                          ))
                        }

                        <div className="cart-total">
                          <div className="total-price">
                            <p>جمع کل سبد خرید</p>
                            <div className="main-price">
                              <p className="price">
                                {total().toLocaleString()}
                              </p>
                              <span>{currencyType()}</span>
                            </div>
                          </div>
                          <Link href={"/cart"}>
                            <Button block>ادامه فرایند خرید</Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Empty description={"سبد خرید خالیست"} />
                    )}
                  </div>
                )}
              >
                <Link href={"/cart"} id="cart">
                  <Image
                    src="/assets/icons/cart.png"
                    height={26}
                    width={26}
                    alt="cart"
                  />
                  <span>{cartItems?.length ?? 0}</span>
                </Link>
              </Dropdown>
            </div>
            <div className="nav-items">
              <span className="nav-circle"></span>
              <ul>
                <li className={router.asPath === "/" ? "active" : ""}>
                  <Link href={"/"}>صفحه اصلی</Link>
                </li>
                <li
                  className={
                    router.asPath === "/workshops/" ||
                    router.route === "/workshops/[[...workshop]]"
                      ? "active"
                      : ""
                  }
                >
                  <Link href={"/workshops"}>ورکشاپ ها</Link>
                </li>
                <li
                  className={
                    router.asPath === "/seminars/" ||
                    router.route === "/seminars/[[...seminar]]"
                      ? "active"
                      : ""
                  }
                >
                  <Link href={"/seminars"}>سمینار ها</Link>
                </li>

                <li
                  className={
                    router.asPath === "/services/" ||
                    router.route === "/service/[[...service]]"
                      ? "active"
                      : ""
                  }
                >
                  <Link href={"/services"}>خدمات</Link>
                </li>

                {menus &&
                  menus.menusApi?.menus?.map(
                    (m: {
                      id: Key | null | undefined;
                      link: string | UrlObject;
                      title: string;
                    }) => {
                      return (
                        <li
                          key={m.id}
                          className={router.asPath === m.link ? "active" : ""}
                        >
                          <Link href={m.link}>{m.title}</Link>
                        </li>
                      );
                    }
                  )}
                <li className={router.asPath === "/contact/" ? "active" : ""}>
                  <Link href={"/contact"}> تماس با ما</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <img
          src="/assets/slides/slide-1.png"
          alt="slide"
          className="main-image"
        />
      </div>
    </>
  );
};

export default memo(MainHeader);

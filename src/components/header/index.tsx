/* eslint-disable react/jsx-no-undef */
import { Button, Col, Drawer, Dropdown, Empty, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../shared/store";
import {
  ArrowLeftOutlined,
  BookTwoTone,
  HomeTwoTone,
  MenuOutlined,
  PhoneTwoTone,
  ShoppingTwoTone,
  VideoCameraTwoTone,
} from "@ant-design/icons";
import CartItem from "./cartItem";
import currencyType from "../currency";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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

  const { data: menus, loading } = useQuery(siteGetMenus, {
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
    console.log(user);
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
          <li className={router.asPath === "/" ? "active" : ""}>
            <HomeTwoTone twoToneColor="#F79826" rev={undefined} />
            <Link href={"/"} onClick={() => setOpen(false)}>
              صفحه اصلی
            </Link>
          </li>
          <li
            className={
              router.asPath === "/courses/" ||
              router.route === "/course/[[...course]]"
                ? "active"
                : ""
            }
          >
            <VideoCameraTwoTone twoToneColor="#F79826" rev={undefined} />
            <Link href={"/courses"} onClick={() => setOpen(false)}>
              رویداد ها
            </Link>
          </li>

          <li className={router.asPath === "/shop/" ? "active" : ""}>
            <ShoppingTwoTone twoToneColor="#F79826" rev={undefined} />
            <Link href={"/shop"} onClick={() => setOpen(false)}>
              فروشگاه
            </Link>
          </li>
          <li className={router.asPath === "/contact/" ? "active" : ""}>
            <PhoneTwoTone twoToneColor="#F79826" rev={undefined} />
            <Link href={"/contact"} onClick={() => setOpen(false)}>
              {" "}
              تماس با ما
            </Link>
          </li>
        </ul>
      </Drawer>
      <div
        id="nav-drawer"
        className={router.asPath !== "/" ? "dark-navbar" : ""}
      >
        <MenuOutlined onClick={showDrawer} rev={undefined} />

        <div id="account">
          <Button>
            {data?.logo && (
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL + "/" + data?.logo}`}
                height={20}
                width={20}
                alt="search"
              />
            )}
          </Button>

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

                    <Image
                      src="/assets/icons/phone-call.png"
                      height={20}
                      width={20}
                      alt="search"
                    />
                  </div>

                  <Button className="header-search">
                    <Image
                      src="/assets/icons/search.png"
                      height={20}
                      width={20}
                      alt="search"
                    />
                  </Button>

                  {user?.type === "user" && <StudentDropdown user={user} />}
                  {user?.type === "instructor" && (
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

                        {cartItems.map((item: Event) => (
                          <span key={item.id}>
                            <CartItem event={item} />
                          </span>
                        ))}

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

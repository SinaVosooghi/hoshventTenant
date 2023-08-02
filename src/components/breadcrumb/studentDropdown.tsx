import { Button, Dropdown, MenuProps, notification } from "antd";
import Link from "next/dist/client/link";
import { handleLogout } from "../../util/utils";
import { useRouter } from "next/router";
import Image from "next/image";
import { User } from "../../datamodel";

const StudentDropdown = ({ user }: { user: User | null }) => {
  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/panel">داشبورد</Link>,
    },
    {
      key: "2",
      label: <Link href="/panel/courses">دوره ها</Link>,
    },
    {
      key: "3",
      label: <Link href="/panel/favorites/">علاقمندی ها</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "signout",
      onClick: () => {
        handleLogout();
        notification.success({ message: "شما از حساب کاربری خارج شدید!" });
        router.push("/");
      },
      label: "خروج از حساب کاربری",
      danger: true,
    },
  ];
  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomLeft"
        overlayClassName="profile-dropdown"
      >
        <Button className={/\/panel/.test(router.asPath) ? "blue" : ""}>
          <Image
            src="/assets/icons/profile.png"
            height={20}
            width={15}
            alt="profile"
          />
          <div className="hidden-xs">
            {
              // @ts-ignore
              user?.firstName
            }{" "}
            {
              // @ts-ignore
              user?.lastName
            }
          </div>
        </Button>
      </Dropdown>
    </>
  );
};

export default StudentDropdown;

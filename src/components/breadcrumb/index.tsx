import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  Row,
  Typography,
  notification,
} from "antd";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "../../datamodel";
import { getUserFromCookie } from "../../util/utils";
import StudentDropdown from "./studentDropdown";
import TeacherDropdown from "./teacherDropdown";

const { Text } = Typography;

const MainBreadCrumb = ({
  secondItem,
  thirdItem,
  fourthIten,
  activeItem,
}: {
  secondItem?: string;
  thirdItem?: string;
  fourthIten?: string;
  activeItem?: string;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  return (
    <Col md={24} xs={24}>
      <Row justify="center">
        <Col md={20} xs={24}>
          <Row justify={router.asPath === "/" ? "end" : "space-between"}>
            <Col span={24}>
              <div id="breadcrumb">
                <Image
                  src="/assets/icons/breadcrumb.png"
                  height={20}
                  width={14}
                  alt="breadcrumb"
                />
                <ul>
                  <li>
                    <Link href={"/"}>صفحه اصلی</Link>
                  </li>
                  {secondItem && <li>{secondItem}</li>}
                  {thirdItem && <li>{thirdItem}</li>}
                  {fourthIten && <li>{fourthIten}</li>}
                  {activeItem && (
                    <li className="active">
                      <Text ellipsis>{activeItem}</Text>
                    </li>
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default MainBreadCrumb;

import { useLazyQuery } from "@apollo/client";
import { Col, Layout, notification, Row } from "antd";
import { getCookie, removeCookies } from "cookies-next";
import MainFooter from "../../components/footer";
import MainHeader from "../../components/header";
import { siteGetUser } from "../../shared/apollo/graphql/queries/user/siteGetUser";
import { useEffect } from "react";
import { User } from "../../datamodel";

const { Content, Footer } = Layout;

const PublicLayout = ({ children }: any) => {
  const [getUser] = useLazyQuery(siteGetUser, {
    fetchPolicy: "network-only",
    onError: (err) => {
      if (err.message === "Unauthorized") {
        removeCookies("user");
        notification.success({ message: "شما از حساب کاربری خارج شدید!" });
        window.location.reload();
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
    }
  }, []);

  return (
    <Layout>
      <MainHeader />
      <Content>
        <Row justify="center">{children}</Row>
      </Content>
      <Footer>
        <MainFooter />
      </Footer>
    </Layout>
  );
};

export default PublicLayout;

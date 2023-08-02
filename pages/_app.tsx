require("../styles/main.less");
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../src/shared/store";
import { ApolloProvider } from "@apollo/client";
import client from "../src/shared/apollo/apollo";
import TeacherLayout from "../src/layouts/teacher";
import PanelLayout from "../src/layouts/panel";

import PublicLayout from "../src/layouts/public";
import { useRouter } from "next/router";
import { ConfigProvider } from "antd";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const layoutType = router.asPath.split("/")[1];
  let Layout = PublicLayout;

  const renderLayout = () => {
    switch (layoutType) {
      case "dashboard":
        return (
          <TeacherLayout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1.0,maximum-scale=1"
              />
            </Head>
            <Component {...pageProps} />
          </TeacherLayout>
        );
      case "panel":
        return (
          <PanelLayout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1.0,maximum-scale=1"
              />
            </Head>
            <Component {...pageProps} />
          </PanelLayout>
        );
      default:
        return (
          <PublicLayout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1.0,maximum-scale=1"
              />
            </Head>
            <Component {...pageProps} />
          </PublicLayout>
        );
    }
  };

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0F295D",
              fontFamily: "Bakh",
              colorBgLayout: "#fff",
              borderRadius: 55,
              colorTextBase: "#0f295d",
            },
          }}
        >
          {renderLayout()}
        </ConfigProvider>
      </ApolloProvider>
    </Provider>
  );
}

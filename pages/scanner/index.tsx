import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Card, Form, Input, message, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import moment from "jalali-moment";
import { ReactQrCode } from "@devmehq/react-qr-code";
import ReactToPrint from "react-to-print";
import { siteGetTimeline } from "../../src/shared/apollo/graphql/queries/timeline/siteGetTimeline";
import { siteCheckin } from "../../src/shared/apollo/graphql/mutations/timeline/siteChekin";
import { siteCheckout } from "../../src/shared/apollo/graphql/mutations/timeline/siteCheckout";
import PrintableCard from "../../src/components/printCard";
import { siteGetUserByMobileNumber } from "../../src/shared/apollo/graphql/queries/user/siteGetUserByMobile";
import useGetSetting from "../../src/hooks/useGetSetting";
import Setting from "../../src/datamodel/Setting";
import { User } from "../../src/datamodel";

require("./style.less");

const Scanner = () => {
  const [user, setUser] = useState<User>();
  const { data: siteData }: { data: Setting } = useGetSetting();

  const [getUserInfo] = useLazyQuery(siteGetUserByMobileNumber, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ userByMobile }) => {
      setUser(userByMobile);
    },
    onError: () => {
      notification.warning({ message: "موردی یافت نشد!" });
    },
  });

  const onFinish = (values: any) => {
    if (values.mobileNumber) {
      getUserInfo({ variables: { mobilenumber: values.mobileNumber } });
    }
  };

  return (
    <Card id="scanner" style={{ margin: "50px 0" }} title="گرفتن کارت ورود">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="شماره موبایل"
          name="mobileNumber"
          rules={[
            { required: true, message: "لطفا شماره موبایل را وارد کنید!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            جستجو
          </Button>
        </Form.Item>
      </Form>
      {user && (
        <PrintableCard
          boxes={siteData}
          name={`${user?.firstName} ${user?.lastName}`}
          event={"کارت ورود"}
          url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${user.uid}`}
        />
      )}
    </Card>
  );
};

export default Scanner;

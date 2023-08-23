import {
  Button,
  Card,
  Col,
  message,
  notification,
  Result,
  Row,
  Typography,
} from "antd";
import React from "react";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import router, { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { LoadingOutlined } from "@ant-design/icons";
import { sitePaymentVerification } from "../../src/shared/apollo/graphql/mutations/verify/verify";
import { getUserFromCookie } from "../../src/util/utils";
import { User } from "../../src/datamodel";
import { Dispatch } from "../../src/shared/store";

const Validate = () => {
  const [inProp, setInProp] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const { Authority, Status } = useRouter().query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<Boolean | null>(null);

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const [verify, { data, error }] = useMutation(sitePaymentVerification, {
    onCompleted: ({ verification }) => {
      if (verification) {
        notification.success({ message: "پرداخت با موفقیت انجام شد" });
        router.push("/panel");
      }
      setStatus(verification);
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      setStatus(false);
      message.error("خطا هنگام بروزرسانی");
    },
  });

  useEffect(() => {
    setLoading(true);
    if (user && Authority) {
      verify({
        variables: {
          input: {
            user: user?.uid,
            authority: Authority,
          },
        },
      });
    }
  }, [Authority, user, verify]);

  return (
    <CSSTransition in={inProp} timeout={300}>
      <Row
        align="top"
        justify="center"
        style={{ height: "60vh", width: "100%" }}
      >
        <Col xs={24} md={20}>
          {loading && (
            <Card style={{ textAlign: "right" }}>
              <Result
                className="text-right"
                status="warning"
                title="درحال پردازش"
                subTitle="شما به صورت خودکار به صفحه دیگری منتقل میشوید، لطفا شکیبا باشد"
                extra={[]}
              />
            </Card>
          )}

          {!status && !loading && (
            <Card>
              <Result
                className="text-right"
                status="error"
                title="تراکنش ناموفق"
                subTitle="مبلغ پرداختی به حساب شما باز میگردد"
              />
            </Card>
          )}
        </Col>
      </Row>
    </CSSTransition>
  );
};

export default Validate;

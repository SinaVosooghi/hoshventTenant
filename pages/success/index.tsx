import { Button, Card, Col, Result, Row } from "antd";
import React from "react";
import Link from "next/link";

import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const Success = () => {
  return (
    <Row align="middle" justify="start" style={{ height: "60vh" }}>
      <Col span={24} xs={24} md={24}>
        <Card>
          <Result
            status="success"
            title="عملیات پرداخت با موفقیت انجام شد"
            extra={[
              <Link href="/" key="home" passHref>
                <Button key="buy" type="default">
                  صفحه نخست
                </Button>
              </Link>,
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Success;

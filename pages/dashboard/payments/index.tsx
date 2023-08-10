import {
  AlertOutlined,
  BankOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Space,
  Tag,
  Table,
  Tooltip,
  Row,
  Col,
  Button,
  Card,
  notification,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { siteCreateChat } from "../../../src/shared/apollo/graphql/mutations/chat/create";
import currencyType from "../../../src/components/currency";
import { siteGetTeachersPayments } from "../../../src/shared/apollo/graphql/queries/payments/siteGetTeachersPayments";

const { Text } = Typography;

const Courses = () => {
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  const [create] = useMutation(siteCreateChat, {
    onCompleted: () => {
      notification.success({ message: "پیام ارسال شد" });
    },
    onError: (error) => {
      notification.error({ message: "خطا در اسال پیام" });
    },
  });

  const requestWithdraw = () => {
    create({
      variables: {
        input: {
          body: "درخواست تسویه حساب.",
          priority: "high",
          subject: "درخواست تسویه حساب.",
          to: 1,
          type: "info",
        },
      },
    });
  };

  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "نام خریدار",
      key: "buyer",
      render: (row) => (
        <Row>
          <Col span={24}>{row.user?.firstName + " " + row.user?.lastName}</Col>
          <Col>
            <Text type="secondary">{row?.course?.title}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "نوع",
      key: "type",
      render: (row) => <span>{row.type === "course" ? "رویداد" : "محصول"}</span>,
    },

    {
      title: "مبلغ",
      key: "price",
      render: (row) => (
        <span>
          {currencyType()}
          {row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "آیدی پرداخت",
      key: "price",
      render: (row) => <>{row.paymentMethodId}</>,
    },
    {
      title: "روش",
      key: "price",
      render: (row) => <>{row.paymentmethod}</>,
    },
    {
      title: "نوع",
      key: "price",
      render: (row) => <>{row.type === "course" ? "رویداد" : "محصول"}</>,
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => <span>{moment(created).format("l")}</span>,
    },
    {
      title: "وضعیت",
      key: "status",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        return <Tag>{status}</Tag>;
      },
    },
  ];

  const [getItems, { data: payments, loading }] = useLazyQuery(
    siteGetTeachersPayments,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
        },
      },
    });
  }, []);

  return (
    <Card
      title={<h3>تراکنش ها</h3>}
      loading={loading}
      extra={
        <Button
          onClick={() => requestWithdraw()}
          type="primary"
          icon={<BankOutlined />}
        >
          درخواست تسویه حساب{" "}
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Table
            columns={columns}
            dataSource={payments?.teacherPaymentsApi?.payments}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

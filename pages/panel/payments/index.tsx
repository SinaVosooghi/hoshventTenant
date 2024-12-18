import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table, Tooltip, Row, Col, Button, Card } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import currencyType from "../../../src/components/currency";
import { siteGetPayments } from "../../../src/shared/apollo/graphql/queries/payments/siteGetPayments";

const Courses = () => {
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "عنوان",
      key: "title",
      render: (row) =>
        row.course?.title ??
        row.products?.map((p: { title: string }) => p.title),
    },
    {
      title: "نوع",
      key: "price",
      render: (row) => <>{row.type === "event" ? "رویداد" : "محصول"}</>,
    },
    {
      title: "مبلغ",
      key: "duration",
      render: (row) => (
        <span>
          {row.amount.toLocaleString()} {currencyType()}
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
        return status ? (
          <Tag color="green">پرداخت شده</Tag>
        ) : (
          <Tag color="red">پرداخت نشده</Tag>
        );
      },
    },
  ];

  const [getItems, { data: payments, loading }] = useLazyQuery(
    siteGetPayments,
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
    <Card title={<h3>تراکنش ها</h3>} loading={loading}>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={payments?.paymentsApi?.payments}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

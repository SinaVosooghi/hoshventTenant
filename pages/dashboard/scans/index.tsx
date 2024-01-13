import { EyeOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import {
  Space,
  Tag,
  Table,
  Tooltip,
  Row,
  Col,
  Button,
  Card,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "jalali-moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import currencyType from "../../../src/components/currency";
import { siteGetScans } from "../../../src/shared/apollo/graphql/queries/scan/siteGetWorkshops";
import momentJalali from "jalali-moment";

const { Text } = Typography;

const Courses = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      render: (row) => <p>{row?.workshop?.title ?? row?.seminar?.title}</p>,
    },
    {
      title: "برای",
      key: "user",
      render: (row) => (
        <p>{row?.user?.firstName + " " + row?.user?.lastName}</p>
      ),
    },
    {
      title: "نوع",
      width: 100,
      render: (row) => <span>{row?.workshop ? "ورکشاپ" : "سمینار"}</span>,
    },
    {
      title: "ورود",
      width: 100,
      render: (row) => (
        <>
          {row?.checkin &&
            momentJalali(row?.checkin).locale("fa").format("H:mm  YYYY/MM/DD ")}
        </>
      ),
    },
    {
      title: "خروج",
      width: 100,
      render: (row) => (
        <>
          {row?.checkout &&
            momentJalali(row?.checkout).locale("fa").format("H:mm  YYYY/MM/DD ")}
        </>
      ),
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => <span>{moment(created).format("l")}</span>,
    },
  ];

  const [getItems, { data, loading }] = useLazyQuery(siteGetScans, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  }, []);

  return (
    <Card title={<h3>لیست اسکن ها</h3>} loading={loading}>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={data?.scans?.scans}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

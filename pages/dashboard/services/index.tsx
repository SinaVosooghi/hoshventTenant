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
import { siteGetServices } from "../../../src/shared/apollo/graphql/queries/services/siteGetServices";

const { Text } = Typography;

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
      render: (row) => <p>{row?.title ?? row?.title}</p>,
    },
    {
      title: "قیمت",
      key: "price",
      render: (row) => (
        <>
          {row?.price ? (
            <>
              {row?.price?.toLocaleString()} {currencyType()}
            </>
          ) : (
            ""
          )}
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

  const [getItems, { data, loading }] = useLazyQuery(siteGetServices, {
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
    <Card title={<h3>لیست سرویس ها</h3>} loading={loading}>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={data?.servicesApi?.services}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table, Tooltip, Row, Col, Button, Card } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { siteGetUserEventsApi } from "../../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
import currencyType from "../../../src/components/currency";

const Courses = () => {
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  const [items, setItems] = useState([]);

  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "عنوان رویداد",
      key: "title",
      render: (row) => (
        <Link passHref href={`/event/${row.event?.slug}`} target="_blank">
          {row.event?.title}
        </Link>
      ),
      responsive: ["lg"],
    },
    {
      title: "مدت",
      key: "duration",
      render: (row) => <span>{row.event?.duration}</span>,
      responsive: ["lg"],
    },
    {
      title: "قیمت",
      key: "price",
      render: (row) => (
        <>
          {row.event?.price?.toLocaleString()} {currencyType()}
        </>
      ),
      responsive: ["lg"],
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => <span>{moment(created).format("l")}</span>,
      responsive: ["lg"],
    },
    {
      title: "وضعیت",
      key: "status",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        return status ? (
          <Tag color="green">فعال</Tag>
        ) : (
          <Tag color="red">غیر فعال</Tag>
        );
      },
      responsive: ["lg"],
    },
    {
      title: "اکشن",
      key: "action",
      width: 50,
      render: (_, record: any) => (
        <Space size="middle">
          <Link passHref href={`/panel/events/view?id=${record.event?.id}`}>
            <Button>جزییات رویداد</Button>
          </Link>
          <Link passHref href={`/event/${record?.event?.slug}`} target="_blank">
            <Tooltip title="مشاهده رویداد">
              <Button>
                <EyeOutlined rev={undefined} />
              </Button>
            </Tooltip>
          </Link>
        </Space>
      ),
      responsive: ["lg"],
    },
  ];

  const [getItems, { data: userEventsApi, loading }] = useLazyQuery(
    siteGetUserEventsApi,
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
    <Card title={<h3>لیست رویداد ها</h3>} loading={loading}>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={userEventsApi?.userEventsApi?.attends}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

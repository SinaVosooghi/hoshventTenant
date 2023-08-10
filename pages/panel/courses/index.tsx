import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table, Tooltip, Row, Col, Button, Card } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { siteGetUserCoursesApi } from "../../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
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
        <Link passHref href={`/course/${row.course?.slug}`} target="_blank">
          {row.course?.title}
        </Link>
      ),
    },
    {
      title: "مدت",
      key: "duration",
      render: (row) => <span>{row.course?.duration}</span>,
    },
    {
      title: "قیمت",
      key: "price",
      render: (row) => (
        <>
          {row.course?.price?.toLocaleString()} {currencyType()}
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
    },
    {
      title: "اکشن",
      key: "action",
      width: 50,
      render: (_, record: any) => (
        <Space size="middle">
          <Link passHref href={`/panel/courses/view?id=${record.course?.id}`}>
            <Button>جزییات رویداد</Button>
          </Link>
          <Link
            passHref
            href={`/course/${record?.course?.slug}`}
            target="_blank"
          >
            <Tooltip title="مشاهده رویداد">
              <Button>
                <EyeOutlined />
              </Button>
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];

  const [getItems, { data: userCoursesApi, loading }] = useLazyQuery(
    siteGetUserCoursesApi,
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
            columns={columns}
            dataSource={userCoursesApi?.userCoursesApi?.attends}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

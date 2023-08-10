import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
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
  Statistic,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { siteGetCourses } from "../../../src/shared/apollo/graphql/queries/event/siteGetEvents";
import { NextSeo } from "next-seo";

const Courses = ({ hideCount = false }: { hideCount?: Boolean }) => {
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
        <Link passHref href={`/dashboard/courses/edit?id=${row.id}`}>
          {row.title}
        </Link>
      ),
    },
    {
      title: "مدت",
      key: "duration",
      dataIndex: "duration",
    },
    {
      title: "ظرفیت",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => (
        <>{capacity ? capacity?.toLocaleString() : "نامحدود"}</>
      ),
    },
    {
      title: "قیمت",
      key: "price",
      render: (row) => <>{row.price?.toLocaleString()}</>,
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
          <Tag color="warning" icon={<WarningOutlined rev={undefined} />}>
            در حال بررسی
          </Tag>
        );
      },
    },
    {
      title: "اکشن",
      key: "action",
      width: 50,
      render: (_, record: any) => (
        <Space size="middle">
          <Link passHref href={`/dashboard/courses/edit?id=${record.id}`}>
            <Tooltip title="ویرایش">
              <EditOutlined rev={undefined} />
            </Tooltip>
          </Link>
          <Link passHref href={`/course/${record.slug}`} target="_blank">
            <Tooltip title="مشاهده">
              <EyeOutlined rev={undefined} />
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];

  const [getItems, { data: courses, loading }] = useLazyQuery(siteGetCourses, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getItems({
      variables: {
        input: {
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          isDeleted: false,
        },
      },
    });
  }, []);

  return (
    <>
      <NextSeo title="رویداد ها" noindex />
      <Card
        title={<h3>لیست رویداد ها</h3>}
        loading={loading}
        extra={
          <Button
            onClick={() => router.push("/dashboard/courses/add")}
            type="primary"
            icon={<PlusOutlined rev={undefined} />}
          >
            افزودن رویداد
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {!hideCount && (
            <Col span={24}>
              <Statistic
                loading={loading}
                title="تعداد کل رویداد ها"
                value={courses?.courses?.count}
                prefix={<ReadOutlined rev={undefined} />}
              />
            </Col>
          )}
          <Col md={24}>
            <Table columns={columns} dataSource={courses?.courses?.courses} />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Courses;

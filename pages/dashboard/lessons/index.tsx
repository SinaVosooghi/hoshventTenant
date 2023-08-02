import {
  BookOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
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
import { siteGetLessons } from "../../../src/shared/apollo/graphql/queries/lesson/siteGetLessons";
import { NextSeo } from "next-seo";

const Lessons = ({ hideCount = false }: { hideCount?: Boolean }) => {
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

  const renderTypes = (type: string) => {
    switch (type) {
      case "text":
        return "متنی";
      case "video":
        return "ویدئو";
      case "conference":
        return "آنلاین";
      default:
        return "-";
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "عنوان کلاس",
      key: "title",
      render: (row) => (
        <Link passHref href={`/dashboard/lessons/edit?id=${row.id}`}>
          {row.title}
        </Link>
      ),
    },
    {
      title: "مدت (دقیقه)",
      key: "duration",
      dataIndex: "duration",
    },
    {
      title: "نوع",
      dataIndex: "type",
      key: "type",
      render: (type) => <>{renderTypes(type)}</>,
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
      title: "لینک کلاس",
      key: "joinlink",
      width: 100,
      render: (row) => {
        const isBefore = moment().isBefore(row?.conferenceoptions?.startdate);
        if (!isBefore && row.type === "conference") {
          return <Button disabled>برگزار شده</Button>;
        }
        return (
          row.type === "conference" && (
            <a
              href={"/dashboard/conference/" + row?.slug}
              target="_blank"
              rel="noreferrer"
            >
              <Button type="dashed" target="_blank">
                لینک شروع کلاس
              </Button>
            </a>
          )
        );
      },
    },
    {
      title: "اکشن",
      key: "action",
      width: 50,
      render: (_, record: any) => (
        <Space size="middle">
          <Link passHref href={`/dashboard/lessons/edit?id=${record.id}`}>
            <Tooltip title="ویرایش">
              <EditOutlined rev={undefined} />
            </Tooltip>
          </Link>
          <Link passHref href={`/dashboard/lessons/view?id=${record.id}`}>
            <Tooltip title="مشاهده">
              <EyeOutlined rev={undefined} />
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];

  const [getItems, { data: lessons, loading }] = useLazyQuery(siteGetLessons, {
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
        },
      },
    });
  }, []);

  return (
    <>
      <NextSeo title="لیست کلاس ها" />
      <Card
        title={<h3>لیست کلاس ها</h3>}
        loading={loading}
        extra={
          <Button
            onClick={() => router.push("/dashboard/lessons/add")}
            type="primary"
            icon={<PlusOutlined rev={undefined} />}
          >
            افزودن کلاس
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {!hideCount && (
            <Col span={24}>
              <Statistic
                loading={loading}
                title="تعداد کل کلاس ها"
                value={lessons?.lessons?.count}
                prefix={<BookOutlined rev={undefined} />}
              />
            </Col>
          )}

          <Col md={24}>
            <Table
              columns={columns}
              dataSource={lessons?.lessons?.lessons}
              rowKey={lessons?.lessons?.lessons.id}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Lessons;

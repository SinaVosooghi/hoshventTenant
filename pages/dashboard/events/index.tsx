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
import { siteGetEventsApi } from "../../../src/shared/apollo/graphql/queries/event/siteGetEventsApi";

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
      title: "عنوان رویداد",
      key: "title",
      render: (row) => (
        <Link passHref href={`/event/${row?.slug}`} target="_blank">
          {row?.title}
          <br />
          <Text type="secondary">{row?.duration}</Text>
        </Link>
      ),
    },
    {
      title: "مدت",
      key: "duration",
      render: (row) => <span>{row?.duration}</span>,
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
      title: "تاریخ شروع",
      width: 100,
      render: (row) => (
        <span>
          {(row?.start_date &&
            moment
              .utc(row?.start_date)
              .locale("fa")
              .format("ddd D MMM, YYYY")) ??
            "-"}
        </span>
      ),
    },
    {
      title: "ساعت شروع",
      width: 100,
      render: (row) => (
        <span>
          {(row?.start_date &&
            moment.utc(row?.start_date).locale("fa").format(" H:mm")) ??
            "-"}
        </span>
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
          <Link passHref href={`/dashboard/events/view?id=${record?.id}`}>
            <Button>جزییات رویداد</Button>
          </Link>
          <Link passHref href={`/dashboard/attendees/${record?.id}`}>
            <Button>لیست مراجعین</Button>
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
    },
  ];

  const [getItems, { data, loading }] = useLazyQuery(siteGetEventsApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
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
            dataSource={data?.eventsApi?.events}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

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
  Statistic,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { siteGetUserEventsApi } from "../../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";
import currencyType from "../../../src/components/currency";
import moment from "jalali-moment";
import PrintableCertificate from "../../../src/components/printCertificate";
import { User } from "../../../src/datamodel";
import { getUserFromCookie } from "../../../src/util/utils";
import { siteGetTimelines } from "../../../src/shared/apollo/graphql/queries/timeline/siteGetTimelines";

const Courses = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  const [user, setUser] = useState<User | null>(null);

  useMemo(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

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
      render: (row) =>
        row.workshop?.title ? (
          <Link
            passHref
            href={`/workshop/${row.workshop?.slug}`}
            target="_blank"
          >
            {row.workshop?.title ?? row.workshop?.title}
          </Link>
        ) : (
          <Link passHref href={`/seminar/${row.seminar?.slug}`} target="_blank">
            {row.seminar?.title ?? row.seminar?.title}
          </Link>
        ),
    },
    {
      title: "تاریخ شروع",
      key: "duration",
      render: (row) => (
        <span>
          {row.workshop?.title
            ? row?.workshop?.start_date &&
              moment(row?.workshop?.start_date ?? null)
                .locale("fa")
                .format("l")
            : row?.seminar?.start_date &&
              moment(row?.seminar?.start_date)
                .locale("fa")
                .format("l")}
        </span>
      ),
    },
    {
      title: "قیمت",
      key: "price",
      render: (row) => (
        <>
          {row.workshop?.price
            ? row.workshop?.price?.toLocaleString() + " " + currencyType()
            : "-"}
        </>
      ),
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => (
        <span>{moment(created).locale("fa").format("l")}</span>
      ),
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
      render: (_, record: any) =>
        record.workshop?.title ? (
          <Link
            passHref
            href={`/workshop/${record?.workshop?.slug}`}
            target="_blank"
          >
            <Tooltip title="مشاهده رویداد">
              <Button>جزییات رویداد</Button>
            </Tooltip>
          </Link>
        ) : (
          <Link
            passHref
            href={`/seminar/${record?.seminar?.slug}`}
            target="_blank"
          >
            <Tooltip title="مشاهده رویداد">
              <Button>جزییات رویداد</Button>
            </Tooltip>
          </Link>
        ),
    },
  ];

  const [getItems, { data: userEventsApi, loading }] =
    useLazyQuery(siteGetUserEventsApi);

  const [getTimelines, { data: userTimelines }] =
    useLazyQuery(siteGetTimelines);

  useEffect(() => {
    if (user) {
      getTimelines({
        variables: {
          input: {
            skip: 0,
            // @ts-ignore
            user: parseInt(user.uid),
          },
        },
      });
    }
  }, [user]);

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
        <Col span={12}>
          <Statistic
            title="مجموع ساعت حضور"
            value={userTimelines?.timelines?.total}
            suffix={"دقیقه"}
          />
        </Col>
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

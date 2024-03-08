import { UserOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import {  Tag, Table, Card, Row, Col, Statistic } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useEffect } from "react";
import { siteGetAttendees } from "../../../src/shared/apollo/graphql/queries/attendees/siteGetAttendees";
import { useRouter } from "next/router";
import moment from "jalali-moment";

const Attendees = ({ hideCount = false }: { hideCount?: Boolean }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  const router = useRouter();
  const { s, w } = router.query;

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
      key: "name",
      render: (row) => <span>{row.workshop?.title ?? row.seminar?.title}</span>,
    },
    {
      title: "شرکت کننده",
      render: (row) => (
        <span>{row.user?.firstName + " " + row.user?.lastName}</span>
      ),
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => <span>{moment(created).locale("fa").locale("fa").format("l")}</span>,
    },
    {
      title: "وضعیت",
      key: "status",
      width: 100,
      render: (row) => {
        return row.user?.status ? (
          <Tag color="green">فعال</Tag>
        ) : (
          <Tag color="red">غیر فعال</Tag>
        );
      },
    },
  ];

  const [getAttendees, { data: attendeesApi, loading }] = useLazyQuery(
    siteGetAttendees,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: (d) => {},
    }
  );

  useEffect(() => {
    getAttendees({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          // @ts-ignore
          ...(w && { w: parseInt(w) }),
          // @ts-ignore
          ...(s && { s: parseInt(s) }),
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  }, [w, s]);

  useEffect(() => {
    getAttendees({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          // @ts-ignore
          ...(w && { w: parseInt(w) }),
          // @ts-ignore
          ...(s && { s: parseInt(s) }),
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  }, []);

  return (
    <Card title={<h3>لیست شرکت کنندگان</h3>} loading={loading}>
      <Row gutter={[8, 16]}>
        {!hideCount && (
          <Col span={24}>
            <Statistic
              loading={loading}
              title="تعداد کل شرکت کنندگان"
              value={attendeesApi?.attendeesApi?.count}
              prefix={<UserOutlined rev={undefined} />}
            />
          </Col>
        )}

        <Col span={24}>
          <Table
            columns={columns}
            scroll={{ x: true }}
            bordered
            dataSource={attendeesApi?.attendeesApi?.attends}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Attendees;

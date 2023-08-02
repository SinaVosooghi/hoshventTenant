import { UserOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table, Card, Row, Col, Statistic } from "antd";
import { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { User } from "../../../src/datamodel";
import { siteGetAttendees } from "../../../src/shared/apollo/graphql/queries/attendees/siteGetAttendees";

const Attendees = ({ hideCount = false }: { hideCount?: Boolean }) => {
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
      title: "دوره",
      key: "name",
      render: (row) => <span>{row.course?.title}</span>,
    },
    {
      title: "شرکت کننده",
      render: (row) => (
        <span>{row.user?.firstName + " " + row.user?.lastName}</span>
      ),
    },
    {
      title: "شماره موبایل",
      render: (row) => <span>{row.user?.mobilenumber}</span>,
    },
    {
      title: "ایمیل",
      render: (row) => <span>{row.user?.email}</span>,
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
      onCompleted: (d) => {
      },
    }
  );

  useEffect(() => {
    let userCookie: User | null = null;
    if (getCookie("user")) {
      // @ts-ignore
      userCookie = JSON.parse(getCookie("user"));
    }

    getAttendees({
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
    <Card title={<h3>لیست شرکت کنندگان</h3>} loading={loading}>
      <Row gutter={[8, 16]}>
        {!hideCount && (
          <Col span={24}>
            <Statistic
              loading={loading}
              title="تعداد کل شرکت کنندگان"
              value={attendeesApi?.attendeesApi?.count}
              prefix={<UserOutlined rev={undefined}/>}
            />
          </Col>
        )}

        <Col span={24}>
          <Table
            columns={columns}
            bordered
            dataSource={attendeesApi?.attendeesApi?.attends}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Attendees;

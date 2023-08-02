import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { User } from "../../../src/datamodel";
import { siteGetUser } from "../../../src/shared/apollo/graphql/queries/user/siteGetUser";

const Courses = () => {
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
      title: "Name",
      key: "name",
      render: (row) => <a>{row.course?.title}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => <>asdasd</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            passHref
            // @ts-ignore
            href={`/dashboard/courses/view?id=${record.course?.id}`}
          >
            View {record.name}
          </Link>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const [getUser, { data: user, loading }] = useLazyQuery(siteGetUser, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    let userCookie: User | null = null;
    if (getCookie("user")) {
      // @ts-ignore
      userCookie = JSON.parse(getCookie("user"));
    }

    getUser({
      variables: {
        // @ts-ignore
        id: parseInt(userCookie?.uid),
      },
    });
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={user?.user?.attendees}
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};

export default Courses;

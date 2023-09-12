import { useLazyQuery } from "@apollo/client";
import { Space, Tag, Table, Card, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { User } from "../../../src/datamodel";
import { siteGetFavorites } from "../../../src/shared/apollo/graphql/queries/favorite/siteGetFavorites";
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
      title: "عنوان",
      key: "name",
      render: (row) => <span>{row.course?.title ?? row.product.title}</span>,
    },
    {
      title: "نوع",
      key: "type",
      render: (row) => <Tag>{row.course?.title ? "رویداد" : "محصول"}</Tag>,
    },

    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      width: 100,
      render: (created) => <span>{moment(created).format("l")}</span>,
    },
    {
      title: "اکشن",
      key: "action",
      width: 100,
      render: (row) => (
        <Link
          href={
            row.course?.title
              ? `/course/${row.course?.slug}`
              : `/product/${row.product.slug}`
          }
        >
          <Button>مشاهده</Button>
        </Link>
      ),
    },
  ];

  const [getItems, { data: favorites, loading }] = useLazyQuery(
    siteGetFavorites,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getItems({
      variables: {
        input: {
          skip: (currentPage - 1) * rowsPerPage,
        },
      },
    });
  }, []);

  return (
    <Card title={<h3>لیست علاقمندی ها</h3>} loading={loading}>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={favorites?.favorites?.favorites}
        pagination={{ hideOnSinglePage: true }}
      />
    </Card>
  );
};

export default Courses;

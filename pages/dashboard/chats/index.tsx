import {
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
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
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { siteCreateChat } from "../../../src/shared/apollo/graphql/mutations/chat/create";
import { siteGetChats } from "../../../src/shared/apollo/graphql/queries/chat/siteGetChats";
const { Option } = Select;

const Courses = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const renderTypes = (type: string) => {
    switch (type) {
      case "alert":
        return <Tag>اخطار</Tag>;
      case "success":
        return <Tag>تایید</Tag>;
      case "info":
        return <Tag>اطلاعات</Tag>;
      case "warning":
        return <Tag>هشدار</Tag>;
      case "invoice":
        return <Tag>فاکتور</Tag>;
      default:
        return "پیام";
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "عنوان",
      key: "subject",
      render: (row) => (
        <Link passHref href={`/dashboard/chats/view?id=${row.id}`}>
          {row.subject}
        </Link>
      ),
    },
    {
      title: "از طرف",
      key: "from",
      render: (row) => row.from?.firstName + " " + row.from?.lastName,
    },
    {
      title: "دپارتمان",
      key: "department",
      render: (row) => row.department ?? "سایت",
    },
    {
      title: "ثبت شده",
      key: "created",
      dataIndex: "created",
      render: (created) => <span>{moment(created).format("l")}</span>,
    },
    {
      title: "نوع",
      dataIndex: "type",
      render: (row) => <>{renderTypes(row)}</>,
    },
    {
      title: "اولویت",
      key: "priority",
      dataIndex: "priority",
      width: 100,
      render: (priority) => {
        if (priority === "high") return <Tag color="red">زیاد</Tag>;
        if (priority === "medium") return <Tag color="warning">متوسط</Tag>;
        if (priority === "low") return <Tag color="blue">پایین</Tag>;
      },
    },
    {
      title: "اکشن",
      key: "action",
      width: 50,
      render: (_, record: any) => (
        <Space size="middle">
          <Link passHref href={`/dashboard/chats/view?id=${record.id}`}>
            <Tooltip title="مشاهده">
              <EyeOutlined rev={undefined} />
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];

  const [create] = useMutation(siteCreateChat, {
    refetchQueries: [siteGetChats],
    onCompleted: () => {
      notification.success({ message: "پیام ارسال شد" });
      form.resetFields();
      setOpen(false);
    },
    onError: (error) => {
      notification.error({ message: "خطا در اسال پیام" });
    },
  });

  const onFinish = (values: any) => {
    if (!values.body) return;
    create({
      variables: {
        input: {
          body: values.body,
          priority: values.priority,
          subject: values.subject,
          to: 1,
          type: "info",
          // @ts-ignore
          site: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  };

  const [getItems, { data: chatsApi, loading }] = useLazyQuery(siteGetChats, {
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
    <Card
      title={<h3>لیست پیام ها</h3>}
      loading={loading}
      extra={
        <Button
          onClick={() => setOpen(true)}
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
        >
          ایجاد پیام جدید
        </Button>
      }
    >
      <Drawer
        title="ارسال پیام جدید"
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="subject"
                label="عنوان"
                rules={[{ required: true, message: "عنوان الزامیست" }]}
              >
                <Input placeholder="عنوان پیام..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="priority"
                label="اولویت"
                rules={[{ required: true, message: "اولویت الزامیست" }]}
              >
                <Select placeholder="اولویت">
                  <Option value="high">بالا</Option>
                  <Option value="medium">متوسط</Option>
                  <Option value="low">پایین</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="body"
                label="متن"
                rules={[
                  {
                    required: true,
                    message: "متن پیام الزامیست",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="پیام" />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button onClick={onClose}>لغو</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              ارسال
            </Button>
          </Space>
        </Form>
      </Drawer>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Statistic
            loading={loading}
            title="تعداد پیام ها"
            value={chatsApi?.chatsApi?.count}
            prefix={<MessageOutlined rev={undefined} />}
          />
        </Col>
        <Col md={24}>
          <Table columns={columns} dataSource={chatsApi?.chatsApi?.chats} />
        </Col>
      </Row>
    </Card>
  );
};

export default Courses;

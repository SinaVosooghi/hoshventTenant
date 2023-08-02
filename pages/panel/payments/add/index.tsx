import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Form, Card, notification, Divider } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import slugify from "slugify-persian";
import { siteCreateCourse } from "../../../../src/shared/apollo/graphql/mutations/course/create";
import CourseInfo from "../components/courseInfo";
import LessonsInfo from "../components/LessonsInfo";

require("../style.less");

const AddCourse = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [body, setBody] = useState("");

  const [create, { loading }] = useMutation(siteCreateCourse, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت ثبت شد" });
      router.push(`/dashboard/courses`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در ذخیره سازی اطلاعات" });
    },
  });

  const onFinish = (values: any) => {
    let image = null;
    if (values.image) image = values.image[0];

    create({
      variables: {
        input: {
          ...values,
          slug: slugify(values.title),
          capacity: parseInt(values.capacity),
          price: values.price ? parseFloat(values.price) : null,
          offprice: values.offprice ? parseFloat(values.offprice) : null,
          prerequisite: values.prerequisite?.map((t: string, i: number) => {
            return { idx: i, title: t };
          }),
          image,
          body,
        },
      },
    });
  };

  return (
    <Card title="افزودن دوره جدید" extra={<PlusOutlined />}>
      <>
        <Form
          name="validate_other"
          onFinish={onFinish}
          initialValues={{
            "input-number": 3,
            "checkbox-group": ["A", "B"],
            rate: 3.5,
            type: "text",
          }}
          size="large"
          form={form}
        >
          <CourseInfo setBody={setBody} body={body} />
          <Divider orientation="left">برنامه کلاسی</Divider>

          <LessonsInfo form={form} />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              ثبت
            </Button>
          </Form.Item>
        </Form>
      </>
    </Card>
  );
};

export default AddCourse;

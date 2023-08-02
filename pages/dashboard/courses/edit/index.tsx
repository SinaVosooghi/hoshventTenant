import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Card, notification, Divider } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import slugify from "slugify-persian";
import Course from "../../../../src/datamodel/Course";
import Lesson from "../../../../src/datamodel/Lesson";
import { siteCreateCourse } from "../../../../src/shared/apollo/graphql/mutations/course/create";
import { siteUpdateCourse } from "../../../../src/shared/apollo/graphql/mutations/course/update";
import { siteGetCourse } from "../../../../src/shared/apollo/graphql/queries/event/siteGetEvent";
import CourseInfo from "../components/courseInfo";
import LessonsInfo from "../components/LessonsInfo";
import { NextSeo } from "next-seo";
import { validateMessages } from "../../../../src/util/messageValidators";

require("../style.less");

const EditCourse = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [images, setImages] = useState(null);

  const [body, setBody] = useState("");
  const [course, setCourse] = useState<Course | null>(null);

  const [update, { loading }] = useMutation(siteUpdateCourse, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت به روز شد" });
      router.push(`/dashboard/courses`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در بروز رسانی اطلاعات" });
    },
  });

  const { loading: fetchLoading } = useQuery(siteGetCourse, {
    notifyOnNetworkStatusChange: true,
    //@ts-ignore
    variables: { id: parseInt(router.query.id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ course }) => {
      setCourse(course);
      const sections = course?.sections.map((section: any) => {
        let lessons: any[] = [];
        const obj = {
          title: section.title,
          lessons,
        };

        lessons = section.lessons?.map((lesson: any) => {
          return { order: lesson.order, lesson: lesson.lesson.id };
        });

        obj.lessons = lessons;

        return obj;
      });

      if (course) {
        form.setFieldsValue({
          ...course,
          prerequisite: course?.prerequisite?.map((i: any) => i.title),
          section: sections,
          category: course?.category.id,
        });

        setBody(course?.body);
        setImages(course?.image);
      }
    },
  });

  const onFinish = (values: any) => {
    let image = images;
    if (values.image && typeof values.image === "object")
      image = values.image[0];

    update({
      variables: {
        input: {
          // @ts-ignore
          id: parseInt(router.query.id),
          ...values,
          slug: slugify(values.title),
          capacity: parseInt(values.capacity),
          price: values.price ? parseFloat(values.price) : null,
          offprice: values.offprice ? parseFloat(values.offprice) : null,
          prerequisite: values.prerequisite?.map((t: string, i: number) => {
            return { idx: i, title: t };
          }),
          status: course?.status,
          image,
          body,
        },
      },
    });
  };

  return (
    <>
      <NextSeo title="ویرایش دوره" noindex />

      <Card
        title="افزودن دوره جدید"
        extra={<PlusOutlined rev={undefined} />}
        loading={fetchLoading}
      >
        <>
          <Form
            form={form}
            name="validate_other"
            onFinish={onFinish}
            validateMessages={validateMessages}
            size="large"
          >
            <CourseInfo
              image={images}
              setImages={setImages}
              setBody={setBody}
              body={body}
            />
            <Divider orientation="left">برنامه کلاسی</Divider>
            <LessonsInfo form={form} />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                به روز رسانی
              </Button>
            </Form.Item>
          </Form>
        </>
      </Card>
    </>
  );
};

export default EditCourse;

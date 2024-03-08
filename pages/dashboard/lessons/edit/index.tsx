import {
  CloseCircleOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Radio,
  Row,
  Switch,
  Upload,
  Card,
  Input,
  notification,
  Space,
  Image,
} from "antd";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import ConferenceBox from "../../components/conference";
import VideoBox from "../../components/video";
import { siteGetLesson } from "../../../../src/shared/apollo/graphql/queries/lesson/siteGetLesson";
import { siteUpdateLesson } from "../../../../src/shared/apollo/graphql/mutations/lesson/updateLesson";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Lesson from "../../../../src/datamodel/Lesson";
import moment from "jalali-moment";
import { NextSeo } from "next-seo";
import { quillModules } from "../../../../src/util/utils";
import { validateMessages } from "../../../../src/util/messageValidators";

const EditLesson = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [type, setType] = useState("text");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [lesson, setLesson] = useState<Lesson>();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const qlRef = useRef(null);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    let fileNames = e.fileList.map(
      (file: { response: { filename: any }[] }) => {
        if (file.response) {
          return file.response[0].filename;
        }
      }
    );
    return fileNames;
  };

  const [update] = useMutation(siteUpdateLesson, {
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت به روز شد" });
      router.push(`/dashboard/lessons`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در به روز رسانی اطلاعات" });
    },
  });

  useQuery(siteGetLesson, {
    //@ts-ignore
    variables: { id: parseInt(router.query.id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ lesson }: { lesson: Lesson }) => {
      if (lesson) {
        form.setFieldsValue({
          ...lesson,
          videooption: {
            video: null,
          },
        });

        if (lesson?.type === "conference") {
          setSelectedDates(
            lesson.conferenceoptions?.weekly_days &&
              lesson.conferenceoptions?.weekly_days?.split(",")
          );

          setSelectedDate(lesson.conferenceoptions?.startdate);
          form.setFieldsValue({
            ...lesson,
            conferenceoptions: {
              joinanytime: lesson.conferenceoptions?.joinanytime,
              host: lesson.conferenceoptions?.host,
              requireauth: lesson.conferenceoptions?.requireauth,
              startdate: null,
              enddate: lesson.conferenceoptions?.enddate,
              schedule_for: lesson.conferenceoptions?.schedule_for,
              joinlink: lesson.conferenceoptions?.joinlink,
              password: lesson.conferenceoptions?.password,
            },
          });
        }

        // @ts-ignore
        setLesson(lesson);
        // @ts-ignore
        setImage(lesson.image);
        setType(lesson?.type);
        setExcerpt(lesson.excerpt);
        setBody(lesson.body);
        setVideo(lesson.videooptions?.video);
      }
    },
  });

  const onFinish = (values: any) => {
    let images = image;
    let conferenceOptions = null;

    if (values.image) images = values.image[0];

    if (values.type === "conference") {
      conferenceOptions = {
        joinanytime: values.conferenceoptions?.joinanytime,
        host: values.conferenceoptions?.host,
        requireauth: values.conferenceoptions?.requireauth,
        startdate: values.conferenceoptions?.startdate
          ? values.conferenceoptions?.startdate.format("YYYY-MM-DDTHH:mm:ss[Z]")
          : selectedDate,
        enddate: values.conferenceoptions?.enddate,
        schedule_for: values.conferenceoptions?.schedule_for,
        joinlink: values.conferenceoptions?.joinlink,
        password: values.conferenceoptions?.password,
        repeat_interval: values.conferenceoptions?.repeat_interval,
        weekly_days: selectedDates ? selectedDates.toString() : null,
      };
    }

    update({
      variables: {
        input: {
          // @ts-ignore
          id: parseInt(router.query.id),
          ...values,
          image: images,
          videooptions: {
            // @ts-ignore
            ...lesson.videooptions,
            video,
          },
          conferenceoptions: conferenceOptions,
          body,
          excerpt,
        },
      },
    });
  };

  return (
    <>
      <NextSeo title={`ویرایش ${lesson?.title}`} />

      <Card title={`ویرایش`} extra={<PlusOutlined rev={undefined} />}>
        <Form
          form={form}
          name="validate_other"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={{
            "input-number": 3,
            "checkbox-group": ["A", "B"],
            rate: 3.5,
            type: "text",
          }}
          size="large"
        >
          <Row gutter={[16, 16]}>
            <Col md={15}>
              <Form.Item
                name="title"
                label="عنوان"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={5}>
              <Form.Item
                name="duration"
                label="طول رویداد(دقیقه)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="public"
                label="عمومی برای همه"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label="گزیده" rules={[{ required: true }]}>
                <ReactQuill
                  modules={quillModules}
                  // @ts-ignore
                  ref={qlRef}
                  className="editor-area excerpt"
                  placeholder="گزیده"
                  theme="snow"
                  value={excerpt ?? ""}
                  onChange={setExcerpt}
                />
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item label="توضیحات ">
                <ReactQuill
                  modules={quillModules}
                  // @ts-ignore
                  ref={qlRef}
                  className="editor-area"
                  placeholder="توضیحات"
                  theme="snow"
                  value={body ?? ""}
                  onChange={setBody}
                />
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item label="نوع کلاس" name="type">
                <Radio.Group>
                  <Radio.Button onClick={() => setType("text")} value="text">
                    متن
                  </Radio.Button>
                  <Radio.Button onClick={() => setType("video")} value="video">
                    ویدئو
                  </Radio.Button>
                  <Radio.Button
                    onClick={() => setType("conference")}
                    value="conference"
                  >
                    آنلاین
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            {type === "conference" && (
              // @ts-ignore
              <ConferenceBox
                joinlink={lesson?.conferenceoptions?.joinlink}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                selectedDate={selectedDate}
              />
            )}
            {type === "video" && (
              <VideoBox
                setVideo={setVideo}
                video={video}
                // @ts-ignore
                lesson={lesson.videooptions}
              />
            )}
            <Col md={24}>
              <Form.Item label="تصویر ">
                <Row gutter={[16, 16]}>
                  <Col md={image ? 18 : 24}>
                    <Form.Item
                      name="image"
                      valuePropName="imagesList"
                      getValueFromEvent={normFile}
                      noStyle
                    >
                      <Upload.Dragger
                        name="image"
                        action={process.env.NEXT_PUBLIC_UPLOAD_MULTIPLE_API}
                        multiple={false}
                        accept="image/*"
                        maxCount={1}
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined rev={undefined} />
                        </p>
                        <p className="ant-upload-text">
                          برای آپلود روی فایل کلیک کنید یا به این قسمت بکشید
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </Col>
                  {image && (
                    <Col>
                      <Space direction="vertical">
                        <Image
                          width={200}
                          alt="image"
                          src={process.env.NEXT_PUBLIC_SITE_URL + "/" + image}
                        />
                        <Button
                          type="primary"
                          size="small"
                          block
                          danger
                          onClick={() => setImage(null)}
                          icon={<CloseCircleOutlined rev={undefined} />}
                        >
                          حذف
                        </Button>
                      </Space>
                    </Col>
                  )}
                </Row>
              </Form.Item>
            </Col>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                به روز رسانی
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default EditLesson;

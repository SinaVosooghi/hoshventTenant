import { InboxOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
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
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { siteCreateLesson } from "../../../../src/shared/apollo/graphql/mutations/lesson/createLesson";
import ConferenceBox from "../../components/conference";
import VideoBox from "../../components/video";
import slugify from "slugify-persian";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";
import moment from "jalali-moment";
import { NextSeo } from "next-seo";
import { quillModules } from "../../../../src/util/utils";
import { validateMessages } from "../../../../src/util/messageValidators";

const AddLesson = () => {
  const router = useRouter();
  const [type, setType] = useState("text");
  const [video, setVideo] = useState(null);

  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

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

  const [create] = useMutation(siteCreateLesson, {
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت ثبت شد" });
      router.push(`/dashboard/lessons`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در ذخیره سازی اطلاعات" });
    },
  });

  const onFinish = (values: any) => {
    let image = null;
    let conferenceOptions = null;
    if (values.image) image = values.image[0];
    if (values.videooptions?.width) {
      values.videooptions.width = values.videooptions?.width
        ? parseFloat(values.videooptions.width)
        : 0;
    }

    if (values.type === "conference") {
      conferenceOptions = {
        joinanytime: values.conferenceoptions?.joinanytime,
        host: values.conferenceoptions?.host,
        requireauth: values.conferenceoptions?.requireauth,
        startdate: values.conferenceoptions?.startdate
          ? values.conferenceoptions?.startdate.format("YYYY-MM-DDTHH:mm:ss[Z]")
          : null,
        enddate: values.conferenceoptions?.enddate,
        schedule_for: values.conferenceoptions?.schedule_for,
        joinlink: values.conferenceoptions?.joinlink,
        password: values.conferenceoptions?.password,
        repeat_interval: values.conferenceoptions?.repeat_interval,
        weekly_days: selectedDates ? selectedDates.toString() : null,
      };
    }

    create({
      variables: {
        input: {
          ...values,
          slug: slugify(values.title),
          conferenceoptions: conferenceOptions,
          image,
          body,
          excerpt,
        },
      },
    });
  };

  return (
    <>
      <NextSeo title="افزودن رویداد" />
      <Card title="افزودن کلاس جدید" extra={<PlusOutlined rev={undefined} />}>
        <Form
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
                <Input placeholder="عنوان کلاس" />
              </Form.Item>
            </Col>
            <Col md={5}>
              <Form.Item
                name="duration"
                label="طول رویداد(دقیقه)"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="3" />
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
              <ConferenceBox
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
              />
            )}
            {type === "video" && <VideoBox setVideo={setVideo} video={video} />}
            <Col md={24}>
              <Form.Item label="تصویر کلاس">
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
              </Form.Item>
            </Col>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                ثبت
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default AddLesson;

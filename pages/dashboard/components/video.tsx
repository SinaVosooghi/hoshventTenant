import {
  CloseCircleOutlined,
  LinkOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";

require("./style.less");

const VideoBox = ({ video, setVideo, lesson }: any) => {
  const [videoType, setVideoType] = useState("link");

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (lesson) {
      setVideoType(lesson?.type);
    }
    return () => {
      setVideoType("link");
    };
  }, [lesson]);

  return (
    <Col md={24} className="course-toolbox">
      <h2>تنظیمات ویدئو</h2>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Form.Item label="نوع کلاس" name={["videooptions", "type"]}>
            <Radio.Group>
              <Radio.Button onClick={() => setVideoType("link")} value="link">
                <LinkOutlined rev={undefined} /> لینک
              </Radio.Button>
              <Radio.Button onClick={() => setVideoType("video")} value="video">
                <VideoCameraOutlined rev={undefined} /> آپلود ویدئو
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        {videoType === "link" ? (
          <>
            <Col md={12}>
              <Form.Item name={["videooptions", "link"]} label="لینک ویدئو">
                <Input placeholder="https://aparat.com/********" dir="ltr"/>
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col md={5}>
              <Form.Item
                name={["videooptions", "width"]}
                label="عرض ویدئو"
                tooltip="  در صورتی که عرض ویدئو شما کم یا زیاد است، می توانید عرض آن را به صورت کلاستی مدیریت کنید"
              >
                <InputNumber type="number" placeholder="320"/>
              </Form.Item>
            </Col>
            <Col md={10}>
              <Form.Item
                label="ویدئو"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="آپلود فایل ویدئو - فرمت فایل .mp4 باید باشد."
              >
                <Upload
                  name="file"
                  type="select"
                  multiple={false}
                  maxCount={1}
                  action={process.env.NEXT_PUBLIC_UPLOAD_VIDEO_API}
                  listType="picture"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={(e) => {
                    if (e.file.status === "done") {
                      setVideo(e.fileList[0].response[0].filename);
                    } else if (e.file.status === "error") {
                      notification.error({
                        message: "خطا",
                        description: `${e.file.response.message}`,
                      });
                    }
                  }}
                >
                  <Button icon={<VideoCameraOutlined rev={undefined} />}>
                    برای آپلود کلیک کنید
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            {video && (
              <Col span={4}>
                <video
                  src={process.env.NEXT_PUBLIC_SITE_URL + "/video/" + video}
                  width="350"
                  controls
                ></video>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginBottom: 20 }}
                  block
                  danger
                  onClick={() => setVideo(null)}
                  icon={<CloseCircleOutlined rev={undefined} />}
                >
                  حذف
                </Button>
              </Col>
            )}
          </>
        )}
      </Row>
    </Col>
  );
};

export default VideoBox;

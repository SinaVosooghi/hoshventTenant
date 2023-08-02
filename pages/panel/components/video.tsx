import { LinkOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, Row, Upload } from "antd";
import { useState } from "react";

require("./style.less");

const VideoBox = () => {
  const [videoType, setVideoType] = useState("link");

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Col md={24} className="course-toolbox">
      <h2>تنظیمات ویدئو</h2>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Form.Item label="نوع کلاس" name="videooptions.type">
            <Radio.Group>
              <Radio.Button onClick={() => setVideoType("link")} value="link">
                <LinkOutlined /> لینک
              </Radio.Button>
              <Radio.Button onClick={() => setVideoType("video")} value="video">
                <VideoCameraOutlined /> آپلود ویدئو
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        {videoType === "link" ? (
          <>
            <Col md={12}>
              <Form.Item name="videooptions.link" label="لینک ویدئو">
                <Input />
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col md={12}>
              <Form.Item name="videooptions.width" label="عرض ویدئو">
                <Input />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                name="video"
                label="ویدئو"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="آپلود فایل ویدئو"
              >
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button icon={<VideoCameraOutlined />}>
                    برای آپلود کلیک کنید
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Col>
  );
};

export default VideoBox;

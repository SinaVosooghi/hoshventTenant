import { Col, DatePicker, Form, Input, Row, Switch } from "antd";

require("./style.less");

const ConferenceBox = () => {
  return (
    <Col md={24} className="course-toolbox">
      <h2>تنظیمات کنفرانس</h2>
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Form.Item name="conferenceoptions.startdate" label="تاریخ شروع:">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item name="conferenceoptions.password" label="رمز عبور">
            <Input />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            name="conferenceoptions.joinanytime"
            label="به شرکت‌کنندگان اجازه دهید تا در هر زمان بپیوندند:"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col md={4}>
          <Form.Item name="conferenceoptions.host" label="میزبان ویدیو:" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            name="conferenceoptions.requireauth"
            label="برای عضویت نیاز به احراز هویت: برای Zoom وارد شوید:"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
};

export default ConferenceBox;

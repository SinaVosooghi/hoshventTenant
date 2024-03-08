import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import moment from "jalali-moment";
import { Suspense, useState } from "react";

require("./style.less");

const { Text } = Typography;

const ConferenceBox = ({
  joinlink,
  selectedDates,
  setSelectedDates,
  selectedDate,
}: {
  joinlink?: string;
  selectedDates: any;
  setSelectedDates: any;
  selectedDate?: any;
}) => {
  const [show, setShow] = useState(false);

  const resetModal = () => {
    setShow(!show);
  };

  const onDateChange = (day: any, status: boolean) => {
    let array = selectedDates;
    if (status) {
      array.push(day.toString());
      setSelectedDates(day);
    } else {
      const index = array.findIndex((i: any) => i == day);
      array.splice(index, 1);
    }

    setSelectedDates(array);
  };

  return (
    <Col md={24} className="course-toolbox">
      <h2>تنظیمات کنفرانس</h2>
      <Row gutter={[16, 16]}>
        <Col md={8}>
          <Form.Item
            name={["conferenceoptions", "startdate"]}
            label="تاریخ شروع:"
            extra={
              <Text type="secondary" dir="ltr" style={{ textAlign: "left" }}>
                {"تاریخ انتخاب شده: " +
                  moment.utc(selectedDate).format("YYYY-MM-DD HH:mm:ss")}
              </Text>
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format={"YYYY-MM-DD HH:mm:ss"}
            />
          </Form.Item>
        </Col>
      </Row>
      <Modal
        open={show}
        onCancel={resetModal}
        title={"تنظیمات تکرار"}
        okText="تایید"
        cancelText="لغو"
        onOk={() => setShow(false)}
      >
        <label onClick={(e) => e.stopPropagation()}>انتخاب روزهای هفته</label>
        <Divider />
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(7, e.target.checked)}
            defaultChecked={selectedDates?.includes("7")}
          >
            شنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(1, e.target.checked)}
            defaultChecked={selectedDates?.includes("1")}
          >
            یکشنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(2, e.target.checked)}
            defaultChecked={selectedDates?.includes("2")}
          >
            دوشنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(3, e.target.checked)}
            defaultChecked={selectedDates?.includes("3")}
          >
            سه شنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(4, e.target.checked)}
            defaultChecked={selectedDates?.includes("4")}
          >
            چهارشنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(5, e.target.checked)}
            defaultChecked={selectedDates?.includes("5")}
          >
            پنجشنبه
          </Checkbox>
        </div>
        <div className="d-flex form-check week_day">
          <Checkbox
            onChange={(e) => onDateChange(6, e.target.checked)}
            defaultChecked={selectedDates?.includes("6")}
          >
            جمعه
          </Checkbox>
        </div>
        <Divider />
        <Col md={4} xs={12}>
          <Form.Item
            name={["conferenceoptions", "repeat_interval"]}
            label="تعداد تکرار"
          >
            <Input />
          </Form.Item>
        </Col>
      </Modal>
    </Col>
  );
};

export default ConferenceBox;

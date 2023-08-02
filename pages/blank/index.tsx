import { Col, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
require("./style.less");

const Teacher = () => {
  return (
    <div id="teacher">
      <MainBreadCrumb secondItem="اساتید" activeItem="علی رضایی نژاد" />
      <Row justify="center">
        <Col md={20} xs={24} id="teacher-container"></Col>
      </Row>
    </div>
  );
};

export default Teacher;

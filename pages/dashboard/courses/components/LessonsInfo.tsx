import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Input, Row, Select } from "antd";
import Lesson from "../../../../src/datamodel/Lesson";
import { siteGetLessons } from "../../../../src/shared/apollo/graphql/queries/lesson/siteGetLessons";
require("../style.less");

const LessonsInfo = ({ form }: any) => {
  const { data, loading } = useQuery(siteGetLessons, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 50,
        skip: 0,
        status: true,
      },
    },
  });

  return (
    <Row gutter={[16, 16]}>
      <Col md={24}>
        <Form.List name="section">
          {(fields, { add, remove }) => {
            return (
              <div className="section-wrapper">
                {fields.map((field, index) => (
                  <>
                    <div className="section-title">
                      <Form.Item
                        {...field}
                        labelCol={{ md: { span: 24 } }}
                        wrapperCol={{ md: { span: 24 } }}
                        name={[field.name, "title"]}
                        fieldKey={[field.key, "title"]}
                        rules={[{ required: true, message: "عنوان الزامیست" }]}
                      >
                        <Input placeholder="عنوان قسمت" />
                      </Form.Item>

                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </div>

                    <Form.List name={[field.name, "lessons"]}>
                      {(lessons, { add, remove }) => {
                        return (
                          <div>
                            {lessons.map((lesson) => (
                              <div key={lesson.key} className="lesson-item">
                                <Form.Item
                                  wrapperCol={{ md: { span: 24 } }}
                                  {...lesson}
                                  name={[lesson.name, "order"]}
                                  fieldKey={[lesson.key, "order"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "order",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="ترتیب"
                                    className="lesson-item-order"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...lesson}
                                  wrapperCol={{ md: { span: 24 } }}
                                  name={[lesson.name, "lesson"]}
                                  fieldKey={[lesson.key, "lesson"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "lesson",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="انتخاب کلاس"
                                    showSearch
                                    loading={loading}
                                    className="lesson-item-lesson"
                                  >
                                    {data?.lessons?.lessons?.map(
                                      (lesson: Lesson) => (
                                        <Select.Option
                                          value={lesson.id}
                                          key={lesson.id}
                                        >
                                          {lesson.title}{" "}
                                        </Select.Option>
                                      )
                                    )}
                                  </Select>
                                </Form.Item>

                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(lesson.name);
                                  }}
                                />
                              </div>
                            ))}

                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  add();
                                }}
                              >
                                <PlusOutlined /> افزودن کلاس
                              </Button>
                            </Form.Item>
                          </div>
                        );
                      }}
                    </Form.List>
                  </>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> افزودن قسمت
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Col>
    </Row>
  );
};

export default LessonsInfo;

import {
  CloseCircleOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { useRef, useState } from "react";
import Category from "../../../../src/datamodel/Category";
import { siteGetCategories } from "../../../../src/shared/apollo/graphql/queries/category/siteGetCategories";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { quillModules } from "../../../../src/util/utils";

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const CourseInfo = ({
  image,
  setImages,
  body,
  setBody,
}: {
  image?: string | null;
  setImages?: any;
  body?: any;
  setBody?: any;
}) => {
  const [categories, setCategories] = useState([]);
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

  useQuery(siteGetCategories, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        type: "course",
      },
    },
    onCompleted: ({ categories }) => {
      setCategories(categories.categories);
    },
  });

  return (
    <Row gutter={[16, 16]}>
      <Col md={16}>
        <Form.Item name="title" label="عنوان" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col md={8}>
        <Form.Item
          label="دسته بندی"
          name="category"
          rules={[{ required: true }]}
        >
          <Select placeholder="انتخاب دسته بندی">
            {categories.map((category: Category) => (
              <Select.Option value={category.id} key={category.id}>
                {category.title}{" "}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col md={24}>
        <Form.Item label="توضیحات">
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

      <Divider orientation="left">جزییات رویداد</Divider>

      <Col md={12}>
        <Form.Item name="video" label="لینک ویدئو">
          <Input />
        </Form.Item>
      </Col>
      <Col md={12}>
        <Form.Item name="classlink" label="لینک کلاس">
          <Input />
        </Form.Item>
      </Col>

      <Col md={6}>
        <Form.Item
          name="duration"
          label="طول رویداد"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col md={6}>
        <Form.Item name="capacity" label="ظرفیت">
          <Input />
        </Form.Item>
      </Col>
      <Col md={6}>
        <Form.Item name="price" label="قیمت رویداد">
          <Input type="number" />
        </Form.Item>
      </Col>
      <Col md={6}>
        <Form.Item name="offprice" label="قیمت تخفیفی">
          <Input type="number" />
        </Form.Item>
      </Col>

      <Col md={12}>
        <Form.List name="prerequisite">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "پیشنیازها" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Please input passenger's name or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="عنوان" style={{ width: "60%" }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  افزودن
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Col>

      <Col md={24}>
        <Form.Item label="تصویر ">
          <Row gutter={[16, 16]}>
            <Col md={image ? 19 : 24}>
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
                    <InboxOutlined />
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
                    onClick={() => setImages(null)}
                    icon={<CloseCircleOutlined />}
                  >
                    حذف
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default CourseInfo;

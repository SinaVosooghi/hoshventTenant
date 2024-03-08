import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Upload,
  Input,
  Image,
  Space,
  notification,
} from "antd";

import { useRouter } from "next/router";

import {
  CloseCircleOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { siteGetUser } from "../../../src/shared/apollo/graphql/queries/user/siteGetUser";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { User } from "../../../src/datamodel";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";
import { siteUpdateUser } from "../../../src/shared/apollo/graphql/mutations/user/updateUser";
import { quillModules } from "../../../src/util/utils";
import { validateMessages } from "../../../src/util/messageValidators";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const GeneralSetting = () => {
  const router = useRouter();
  const [about, setAbout] = useState("");
  const qlRef = useRef(null);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);

  const [getUser, { data: user, loading }] = useLazyQuery(siteGetUser, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: async ({ user }: { user: User }) => {
      if (user) {
        form.setFieldsValue({
          ...user,
        });

        // @ts-ignore
        setImage(user.avatar);
        setAbout(user.about);
      }
    },
  });

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

  useEffect(() => {
    let userCookie: User | null = null;
    if (getCookie("user")) {
      // @ts-ignore
      userCookie = JSON.parse(getCookie("user"));
    }

    getUser({
      variables: {
        // @ts-ignore
        id: parseInt(userCookie?.uid),
      },
    });
  }, []);

  const [update] = useMutation(siteUpdateUser, {
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت به روز شد" });
      router.push(`/dashboard/`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در به روز رسانی اطلاعات" });
    },
  });

  const onFinish = (values: any) => {
    let images = image;
    if (values.image) images = values.image[0];
    delete values.image;

    let userCookie: User | null = null;
    if (getCookie("user")) {
      // @ts-ignore
      userCookie = JSON.parse(getCookie("user"));
    }

    update({
      variables: {
        input: {
          ...values,
          id: parseInt(userCookie?.uid),
          about,
        },
      },
    });
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Row gutter={[16, 16]}>
        <Col md={12} xs={24}>
          <Form.Item
            label="ایمیل"
            tooltip="این اطلاعات به صورت عمومی نمایش داده نمی شوند"
          >
            <span className="ant-form-text">{user?.user?.email}</span>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="موبایل"
            tooltip="این اطلاعات به صورت عمومی نمایش داده نمی شوند"
          >
            <span className="ant-form-text">{user?.user?.mobilenumber}</span>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item label="نام" name="firstName" rules={[{ required: true }]}>
            <Input placeholder="نام" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="نام خانوادگی"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={24}>
          <Form.Item label="درباره من" rules={[{ required: true }]}>
            <ReactQuill
              modules={quillModules}
              // @ts-ignore
              ref={qlRef}
              className="editor-area excerpt"
              placeholder="گزیده"
              theme="snow"
              value={about ?? ""}
              onChange={setAbout}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large">
          به روز رسانی
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GeneralSetting;

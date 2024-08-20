import "react-quill/dist/quill.snow.css";

import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Upload,
  notification,
} from "antd";
import {
  CloseCircleOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import { User } from "../../../src/datamodel";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { quillModules } from "../../../src/util/utils";
import { siteGetUser } from "../../../src/shared/apollo/graphql/queries/user/siteGetUser";
import { siteUpdateUser } from "../../../src/shared/apollo/graphql/mutations/user/updateUser";
import { useRef } from "react";
import { useRouter } from "next/router";
import { validateMessages } from "../../../src/util/messageValidators";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const [avatarFile, setAvatarFile] = useState(null);

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

  const [update] = useMutation(siteUpdateUser, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    onCompleted: () => {
      notification.success({ message: "اطلاعات با موفقیت به روز شد" });
      router.push(`/panel/`);
    },
    onError: (error) => {
      notification.error({ message: "خطا در به روز رسانی اطلاعات" });
    },
  });

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

  const onFinish = (values: any) => {
    delete values.avatar;
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
          ...(typeof avatarFile !== "string" && { avatar: avatarFile }),
          about,
        },
      },
    });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
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
          <Form.Item label="تصویر ">
            <Row gutter={[16, 16]}>
              <Col md={image ? 18 : 24}>
                <Form.Item name="avatar" valuePropName="fileList" noStyle>
                  <Input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleAvatarChange}
                  />
                </Form.Item>
              </Col>
              {image && (
                <Col>
                  <Space direction="vertical">
                    <Image
                      style={{
                        borderRadius: 200,
                        height: 200,
                        width: 200,
                        objectFit: "cover",
                      }}
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

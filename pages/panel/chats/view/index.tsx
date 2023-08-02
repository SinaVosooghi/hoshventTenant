import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Form, Input, notification } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "../../../../src/datamodel";
import { siteGetChat } from "../../../../src/shared/apollo/graphql/queries/chat/siteGetChat";
import { getUserFromCookie } from "../../../../src/util/utils";
import parse from "html-react-parser";
import Message from "../../../../src/datamodel/Message";
import { siteCreateMessage } from "../../../../src/shared/apollo/graphql/mutations/message/create";
import { SendOutlined, UserOutlined } from "@ant-design/icons";

require("./style.less");

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const { data, loading } = useQuery(siteGetChat, {
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: parseFloat(id) },
    pollInterval: 5000,
    ssr: false,
    onCompleted: ({ chatApi }) => {
      setMessages([]);
      setMessages(chatApi.messages);
    },
  });

  const [create] = useMutation(siteCreateMessage, {
    refetchQueries: [siteGetChat],
    onCompleted: () => {
      notification.success({ message: "پیام ارسال شد" });
      form.resetFields();
    },
    onError: (error) => {
      notification.error({ message: "خطا در اسال پیام" });
    },
  });

  const onFinish = (values: any) => {
    if (!values.body) return;
    create({
      variables: {
        input: {
          body: values.body,
          chat: data?.chatApi?.id,
        },
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card
      loading={loading}
      title={`مشاهده ${data?.chatApi.subject}`}
      className="chat-body"
      extra={moment(data?.chatApi.created).format("YYYY/M/D H:m ")}
    >
      <section className="msger">
        <main className="msger-chat">
          {messages.length ? (
            messages.map((message: Message) => {
              // @ts-ignore
              return message.user.id === parseFloat(user.uid) ? (
                <div className="msg left-msg" key={message.id}>
                  <div className="msg-img">
                    <UserOutlined rev={undefined}/>
                  </div>

                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">
                        {message.user?.firstName + " " + message.user?.lastName}
                      </div>
                      <div className="msg-info-time">
                        {moment(message?.created).format("YYYY/M/D | H:m")}
                      </div>
                    </div>

                    <div className="msg-text">{parse(message?.body)}</div>
                  </div>
                </div>
              ) : (
                <div className="msg right-msg" key={message.id}>
                  <div className="msg-img">
                    <UserOutlined rev={undefined}/>
                  </div>

                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">
                        {message.user?.firstName + " " + message.user?.lastName}
                      </div>{" "}
                      <div className="msg-info-time">
                        {moment(message?.created).format("YYYY/M/D | H:m")}
                      </div>{" "}
                    </div>

                    <div className="msg-text">{parse(message?.body)}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </main>

        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="msger-inputarea"
        >
          <Button
            htmlType="submit"
            size="large"
            className="msger-send-btn"
            icon={<SendOutlined />}
          ></Button>
          <Form.Item
            name="body"
            rules={[{ required: true, message: "متن الزامیست!" }]}
            className="msger-input"
          >
            <Input type="text" className="msger-input" placeholder="پیام..." />
          </Form.Item>
        </Form>
      </section>
    </Card>
  );
};

export default Edit;

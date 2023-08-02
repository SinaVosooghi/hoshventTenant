import {
  Button,
  Form,
  Input,
  Modal,
  Slider,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState, memo } from "react";
import { useMutation } from "@apollo/client";
import { siteCreateReview } from "../../shared/apollo/graphql/mutations/review/create";
import { siteGetCourseApi } from "../../shared/apollo/graphql/queries/event/siteGetEventApi";
import useGetSetting from "../../hooks/useGetSetting";
import Setting from "../../datamodel/Setting";
import { siteGetReviews } from "../../shared/apollo/graphql/queries/review/siteGetReviews";

const { Text } = Typography;
const { TextArea } = Input;

const CreateComment = ({
  open = false,
  setClose,
  itemTitle,
  itemId,
  type,
  hideRating,
}: {
  open: boolean;
  setClose: any;
  itemTitle?: string;
  itemId: number;
  type: "course" | "product" | "blog";
  hideRating?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data }: { data: Setting } = useGetSetting();
  const [questions, setQuestions] = useState<any>();
  const [initialQuestions, setInitialQuestions] = useState<any>();

  const [create, { loading: reviewLoading }] = useMutation(siteCreateReview, {
    refetchQueries: [siteGetCourseApi, siteGetReviews],
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      notification.success({
        message: "ثبت شد",
        description: "دیدگاه شما با موفقیت شد.",
      });
      setClose(false);
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "برای ثبت دیدگاه ابتدا باید وارد حساب کاربری شوید",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  useEffect(() => {
    if (data?.courseQuestion?.questions?.length) {
      setQuestions(data?.courseQuestion?.questions);
      const obj = {};
      data?.courseQuestion?.questions?.map((item) => {
        // @ts-ignore
        obj[item.title] = 2;
      });
      setInitialQuestions(obj);
    }
  }, [data]);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const handleOk = () => {
    setClose(false);
  };

  const handleCancel = () => {
    setClose(false);
  };

  const onFinish = (values: any) => {
    create({
      variables: {
        input: {
          type,
          ...(type === "blog" && { blog: itemId }),
          ...(type === "course" && { course: itemId }),
          ...(type === "product" && { product: itemId }),

          body: values.body,
          answers: values.questions,
        },
      },
    });
  };

  return (
    <>
      <Modal
        title={
          <Space direction="vertical" size={0}>
            <Text strong>دیدگاه شما</Text>
            {itemTitle && <Text type="secondary">در مورد {itemTitle}</Text>}
          </Space>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
        className="review-modal"
        destroyOnClose
        centered
      >
        <Form
          layout="horizontal"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ questions: initialQuestions }}
        >
          {!hideRating && (
            <>
              <Text strong>امتیاز دهید:</Text>
              <div className="modal-sliders">
                {questions &&
                  questions.length &&
                  questions.map((question: { title: string }, idx: number) => {
                    return (
                      <Form.Item
                        name={["questions", question.title]}
                        label={question.title}
                        key={idx}
                      >
                        <Slider
                          min={1}
                          max={5}
                          dots
                          tooltip={{ formatter: null }}
                        />
                      </Form.Item>
                    );
                  })}
              </div>
            </>
          )}

          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong> دیدگاه خود را شرح دهید:</Text>
            <Form.Item
              name="body"
              label="متن نظر"
              rules={[{ required: true, message: "این فیلد الزامیست!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={reviewLoading}>
                ثبت دیدگاه
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default memo(CreateComment);

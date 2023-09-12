import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  Card,
  Form,
  Radio,
  Select,
  Spin,
  message,
  notification,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { siteGetTimeline } from "../../../src/shared/apollo/graphql/queries/timeline/siteGetTimeline";
import moment from "jalali-moment";
import { ReactQrCode } from "@devmehq/react-qr-code";
import { siteCheckin } from "../../../src/shared/apollo/graphql/mutations/timeline/siteChekin";
import { siteCheckout } from "../../../src/shared/apollo/graphql/mutations/timeline/siteCheckout";
import ReactToPrint from "react-to-print";
import { siteGetUser } from "../../../src/shared/apollo/graphql/queries/user/siteGetUser";
import { User } from "../../../src/datamodel";
import { getCookie, getCookies } from "cookies-next";

require("./style.less");

const Scanner = () => {
  const [data, setData] = useState("No result");
  const [attendee, setAttendee] = useState();
  const componentRef = useRef();
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isWorkshop, setIsWorkshop] = useState(true);
  const [form] = Form.useForm();
  const [isCheckin, setIsCheckin] = useState(true);

  const [getUserInfo] = useLazyQuery(siteGetTimeline, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ timeline }) => {
      setAttendee(timeline);
    },
    onError: () => {
      notification.warning({ message: "موردی یافت نشد!" });
    },
  });

  const [getUser, { data: user, loading }] = useLazyQuery(siteGetUser, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
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

  const [checkin, { loading: checkinLoading }] = useMutation(siteCheckin, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      message.success("ورود شما با موفقیت ثبت شد!");
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "خطا در ثبت",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  const [checkout, { loading: checkoutLoading }] = useMutation(siteCheckout, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      message.success("خروج شما با موفقیت ثبت شد!");
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "خطا در ثبت",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  useEffect(() => {
    if (data) {
      getUserInfo({
        variables: {
          input: {
            url: data,
            ...(isWorkshop && { workshop: selectedWorkshop?.toString() }),
            ...(!isWorkshop && { seminar: selectedSeminar?.toString() }),
            checkin: isCheckin,
          },
        },
      });
    }
  }, [data]);

  const checkinHandler = (id: number, type: string) => {
    checkin({
      variables: {
        aid: parseInt(attendee?.id),
        type,
        id: parseInt(id),
      },
    });
  };

  const checkoutHandler = (id, type) => {
    checkout({
      variables: {
        aid: parseInt(attendee?.id),
        type,
        id: parseInt(id),
      },
    });
  };

  const renderUsertype = (type: string) => {
    let t = "کاربر";
    switch (type) {
      case "user":
        t = "کاربر";
        break;
      case "lecturer":
        t = "سخنران";
        break;
      case "instructor":
        t = "عوامل اجرایی";
        break;
      case "tenant":
        t = "مدریر سایت";
        break;
      case "guest":
        t = "میهمان";
        break;
    }

    return t;
  };

  const renderCamera = () => {
    if (selectedSeminar || selectedWorkshop) {
      return (
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
        />
      );
    }
  };

  return (
    <Card>
      <div className="scanner-alert">
        <Alert
          message="برای اسکن کردن یک ورکشاپ یا یک رویداد جانبی را انتخاب کنید!"
          showIcon
        />
        <div className="select-items">
          <Form form={form} name="control-hooks" style={{ maxWidth: 600 }}>
            <Form.Item label="نوع" name="type">
              <Radio.Group defaultValue="checkin">
                <Radio.Button
                  value="checkin"
                  onChange={() => {
                    setIsCheckin(true);
                    form.setFieldsValue({
                      type: "checkin",
                    });
                  }}
                >
                  ورود
                </Radio.Button>
                <Radio.Button
                  value="checkout"
                  onChange={() => {
                    setIsCheckin(false);
                    form.setFieldsValue({
                      type: "checkout",
                    });
                  }}
                >
                  خروج
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            {user?.user?.workshops?.length ? (
              <Form.Item name="workshop" label="انتخاب ورکشاپ">
                <Select
                  placeholder="انتخاب ورکشاپ"
                  style={{ minWidth: 280 }}
                  value={selectedWorkshop}
                  onChange={(e) => {
                    form.setFieldsValue({
                      workshop: e,
                      seminar: null,
                    });
                    setIsWorkshop(true);

                    setSelectedSeminar(null);
                    setSelectedWorkshop(e);
                  }}
                >
                  {user?.user?.workshops?.map((workshop) => (
                    <Select.Option value={workshop.id} key={workshop.id}>
                      {workshop.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              ""
            )}

            {user?.user?.seminars?.length ? (
              <Form.Item name="seminar" label="انتخاب سمینار">
                <Select
                  placeholder="انتخاب سمینار"
                  style={{ minWidth: 280 }}
                  value={selectedSeminar}
                  onChange={(e) => {
                    setIsWorkshop(false);
                    setSelectedWorkshop(null);
                    setSelectedSeminar(e);
                    form.setFieldsValue({
                      workshop: null,
                      seminar: e,
                    });
                  }}
                >
                  {user?.user?.seminars?.map((seminar) => (
                    <Select.Option value={seminar.id} key={seminar.id}>
                      {seminar.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              ""
            )}
          </Form>
        </div>
      </div>
      <div className="camera">
        {loading ? <Spin spinning /> : renderCamera()}
      </div>
      {attendee && (
        <div id="user-profile">
          <div className="card-container" id="card">
            <span className="pro">
              {renderUsertype(attendee?.user?.usertype)}
            </span>
            <div className="qrcode">
              <ReactQrCode
                value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${attendee?.user.id}&e=${attendee?.event?.id}`}
                size={100}
                viewBox={`0 0 100 100`}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#fff",
                }}
                renderAs="canvas"
                id="qr"
              />
            </div>
            <h3>
              {attendee?.user?.firstName} {attendee?.user?.lastName}
            </h3>
            <h5>{attendee?.user?.mobilenumber}</h5>
            <p>
              <b>
                {attendee?.user?.email} <br /> عضویت:{" "}
              </b>
              {moment(attendee?.user?.created)
                .locale("fa")
                .format("ddd D MMM, YYYY")}
            </p>

            <div className="skills">
              <h1>{attendee?.event?.title}</h1>
              {attendee?.event?.halls?.map((hall) => {
                return (
                  <>
                    <h6>{hall.title}</h6>
                    <ul>
                      {hall.seminars?.map((seminar) => (
                        <li>{seminar.title}</li>
                      ))}
                      {hall.workshops?.map((workshop) => (
                        <li>{workshop.title}</li>
                      ))}
                    </ul>
                  </>
                );
              })}
            </div>
          </div>
          <div style={{ display: "none" }}>
            <div ref={componentRef} style={{ padding: 20 }}>
              <div
                style={{ width: 200, textAlign: "center", margin: "0 auto" }}
              >
                <ReactQrCode
                  value={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${attendee?.user.id}&e=${attendee?.event?.id}`}
                  size={100}
                  viewBox={`0 0 100 100`}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                  }}
                  renderAs="canvas"
                  id="qr"
                />
              </div>
              <h3 style={{ textAlign: "center" }}>
                {attendee?.user?.firstName} {attendee?.user?.lastName}
              </h3>
              <h5 style={{ textAlign: "center" }}>
                {attendee?.user?.mobilenumber}
              </h5>
              <p style={{ textAlign: "center" }}>
                <b>
                  {attendee?.user?.email} <br /> عضویت:{" "}
                </b>
                {moment(attendee?.user?.created)
                  .locale("fa")
                  .format("ddd D MMM, YYYY")}
              </p>

              <div style={{ textAlign: "center" }}>
                <h1>{attendee?.event?.title}</h1>
                {attendee?.event?.halls?.map((hall) => {
                  return (
                    <>
                      <h6>{hall.title}</h6>
                      <ul>
                        {hall.seminars?.map((seminar) => (
                          <li>{seminar.title}</li>
                        ))}
                        {hall.workshops?.map((workshop) => (
                          <li>{workshop.title}</li>
                        ))}
                      </ul>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <ReactToPrint
            trigger={() => (
              <Button size="large" type="primary">
                پریت کارت ورود
              </Button>
            )}
            content={() => componentRef.current}
          />
        </div>
      )}
    </Card>
  );
};

export default Scanner;

import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Card, message, notification } from "antd";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { siteGetTimeline } from "../../../src/shared/apollo/graphql/queries/timeline/siteGetTimeline";
import moment from "jalali-moment";
import { ReactQrCode } from "@devmehq/react-qr-code";
import { siteCheckin } from "../../../src/shared/apollo/graphql/mutations/timeline/siteChekin";
import { siteCheckout } from "../../../src/shared/apollo/graphql/mutations/timeline/siteCheckout";

require("./style.less");

const Scanner = () => {
  const [data, setData] = useState("No result");
  const [attendee, setAttendee] = useState();
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
          url: data,
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

  return (
    <Card>
      <div className="camera">
        <QrReader
          constraints={{ facingMode: "user" }}
          onResult={(result, error) => {
            if (!!result) {
              console.log(result?.text)
              setData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          videoStyle={{ borderRadius: "250px" }}
          containerStyle={{ width: "100%" }}
        />
      </div>
      {attendee && (
        <div id="user-profile">
          <div className="card-container">
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
                        <li>
                          {seminar.title}
                          <div className="buttons">
                            <Button
                              className="primary"
                              loading={checkinLoading}
                              onClick={() => {
                                checkinHandler(seminar.id, "seminar");
                              }}
                            >
                              ثبت ورود
                            </Button>
                            <Button
                              className="primary ghost"
                              loading={checkoutLoading}
                              onClick={() => {
                                checkoutHandler(seminar.id, "seminar");
                              }}
                            >
                              ثبت خروج
                            </Button>
                          </div>
                        </li>
                      ))}
                      {hall.workshops?.map((workshop) => (
                        <li>
                          {workshop.title}
                          <div className="buttons">
                            <Button
                              className="primary"
                              loading={checkinLoading}
                              onClick={() => {
                                checkinHandler(workshop.id, "workshop");
                              }}
                            >
                              ثبت ورود
                            </Button>
                            <Button
                              className="primary ghost"
                              loading={checkoutLoading}
                              onClick={() => {
                                checkoutHandler(workshop.id, "workshop");
                              }}
                            >
                              ثبت خروج
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Scanner;

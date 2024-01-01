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
import Setting from "../../../src/datamodel/Setting";
import useGetSetting from "../../../src/hooks/useGetSetting";
import PrintableCard from "../../../src/components/printCard";
import { siteManualCheckin } from "../../../src/shared/apollo/graphql/mutations/timeline/siteManualCheckin";

require("./style.less");

const Scanner = () => {
  const [data, setData] = useState("No result");
  const [attendee, setAttendee] = useState();
  const componentRef = useRef();
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [type, setType] = useState<"workshop" | "seminar" | "service" | null>(
    null
  );
  const [form] = Form.useForm();
  const [isCheckin, setIsCheckin] = useState(true);
  const { data: siteData }: { data: Setting } = useGetSetting();
  const [showError, setShowError] = useState(false);

  const [getUserInfo] = useLazyQuery(siteGetTimeline, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ timeline }) => {
      notification.success({ message: "ثبت شد" });
      setAttendee(timeline);
    },
    onError: (err) => {
      setShowError(true);
      if (err.message === "Already checkin") {
        notification.warning({ message: "قبلا ثبت شده است" });
      } else {
        notification.warning({ message: "موردی یافت نشد!" });
      }
    },
  });

  const [getUser, { data: user, loading }] = useLazyQuery(siteGetUser, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    let userCookie: User | null = null;
    setShowError(false);
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

  useEffect(() => {
    setShowError(false);
    if (data) {
      getUserInfo({
        variables: {
          input: {
            url: data,
            ...(type === "workshop" && {
              workshop: selectedWorkshop?.toString(),
            }),
            ...(type === "seminar" && { seminar: selectedSeminar?.toString() }),
            ...(type === "service" && { service: selectedService?.toString() }),
            checkin: isCheckin,
          },
        },
      });
    }
  }, [data]);

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
    if (selectedSeminar || selectedWorkshop || selectedService) {
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
        {showError && (
          <Alert
            message={"موردی یافت نشد!"}
            type="error"
            showIcon
            style={{ marginBottom: 20, marginTop: 10 }}
          />
        )}
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
                      service: null,
                    });
                    setType("workshop");
                    setShowError(false);

                    setSelectedSeminar(null);
                    setSelectedWorkshop(e);
                    setSelectedService(null);
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
                    setType("seminar");
                    setShowError(false);
                    setSelectedWorkshop(null);
                    setSelectedSeminar(e);
                    setSelectedService(null);

                    form.setFieldsValue({
                      workshop: null,
                      seminar: e,
                      service: null,
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

            {user?.user?.services?.length ? (
              <Form.Item name="service" label="انتخاب سرویس">
                <Select
                  placeholder="انتخاب سرویس"
                  style={{ minWidth: 280 }}
                  value={setSelectedService}
                  onChange={(e) => {
                    form.setFieldsValue({
                      workshop: null,
                      seminar: null,
                      service: e,
                    });
                    setType("service");
                    setShowError(false);

                    setSelectedSeminar(null);
                    setSelectedWorkshop(null);
                    setSelectedService(e);
                  }}
                >
                  {user?.user?.services?.map((service) => (
                    <Select.Option value={service.id} key={service.id}>
                      {service.title}
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
              <h1>{attendee?.workshop?.title}</h1>
              <h1>{attendee?.seminar?.title}</h1>
              <h1>{attendee?.service?.title}</h1>
            </div>
          </div>
          <div>
            <PrintableCard
              boxes={siteData}
              name={`${attendee?.user?.firstName} ${attendee?.user?.lastName}`}
              event={attendee?.event?.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/scan&u=${attendee?.user.id}&e=${attendee?.event?.id}`}
              user={attendee.user}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Scanner;

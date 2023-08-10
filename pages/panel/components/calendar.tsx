import { useLazyQuery } from "@apollo/client";

import { Row, Col, Card, notification } from "antd";
import { useState, memo } from "react";
import { useEffect } from "react";
import { siteGetLessons } from "../../../src/shared/apollo/graphql/queries/lesson/siteGetLessons";
import { NextSeo } from "next-seo";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Lesson from "../../../src/datamodel/Lesson";
import moment from "moment";
import useGetSetting from "../../../src/hooks/useGetSetting";
import { siteGetUserEventsApi } from "../../../src/shared/apollo/graphql/queries/event/siteGetUserEventsApi";

require("./style.less");

const Calendar = () => {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState(null);
  const [events, setEvents] = useState([]);
  const { data } = useGetSetting();

  const [getItems, { data: userEventsApi, loading }] = useLazyQuery(
    siteGetUserEventsApi,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: ({ userEventsApi }) => {
        const data: any = [];
        const e = userEventsApi?.attends.map((attend: any) => {
          data.push({
            ...attend.event,
            title: attend.event.title,
            start: attend.event.start_date,
          });
        });

        setEvents(data);
      },
    }
  );

  //   const events = [{ title: "Meeting", start: new Date() }];

  useEffect(() => {
    getItems({
      variables: {
        input: {
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
        },
      },
    });
  }, []);

  const onEventClick = (event: any) => {
    const lastConference = event?._def?.extendedProps;
    const isBefore = moment().isBefore(moment(lastConference?.start_date));

    // if (!isBefore) {
    //   return notification.error({
    //     message: "خطا",
    //     description: "این رویداد برگزار شده است!",
    //   });
    // }

    return window.open("/event/" + lastConference?.slug, "_blank");
  };

  return (
    <>
      {events.length ? (
        <>
          <Card title={<h3>لیست کلاس ها</h3>} loading={loading}>
            <Row gutter={[16, 16]}>
              <Col md={24}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  weekends={true}
                  events={events}
                  locale="fa"
                  direction="rtl"
                  firstDay={6}
                  eventClick={(e) => {
                    onEventClick(e.event);
                  }}
                />
              </Col>
            </Row>
          </Card>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default memo(Calendar);

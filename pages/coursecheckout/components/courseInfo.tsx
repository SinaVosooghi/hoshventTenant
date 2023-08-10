import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Tooltip } from "antd";
import Image from "next/image";
import Course from "../../../src/datamodel/Course";
import { percentCalculate } from "../../../src/util/utils";
import parse from "html-react-parser";
import currencyType from "../../../src/components/currency";

const CourseCheckoutInfo = ({ course }: { course: Course | null }) => {
  const calculateLessonsCount = () => {
    let i = 0;
    course?.sections.map((section) => {
      // @ts-ignore
      section.lessons.map((lesson) => i++);
    });
    return i;
  };
  return (
    <div className="course-checkout-info">
      <div className="course-checkout-title">
        <span>رویداد</span>
        <h1>{course?.title}</h1>
      </div>
      <div className="organizer-detail">
        <Avatar size={64} icon={<UserOutlined rev={undefined} />} />
        <div>
          <span>مکلاس رویداد</span>
          <p>
            {course?.organizer?.firstName} {course?.organizer?.lastName}
          </p>
        </div>
      </div>
      <div className="course-details">
        <div className="course-total">
          <div className="course-time">
            <Image
              src="/assets/clock-circle.png"
              alt="rasta"
              width={41}
              height={41}
            />
            {course?.duration}
          </div>

          <div className="course-lessons">
            <p>{calculateLessonsCount()}</p>
            جلسه
          </div>
        </div>
        <div className="course-price-container">
          {course?.offprice && (
            <div className="course-off-price">
              <p>{course?.offprice.toLocaleString()}</p>
              <span>{percentCalculate(course?.offprice, course?.price)}%</span>
            </div>
          )}

          <div className="course-price">
            {course?.price ? (
              <>
                {course?.price.toLocaleString()}{" "}
                <small>{currencyType()} </small>
              </>
            ) : (
              "رایگان"
            )}
          </div>
        </div>
      </div>
      {course?.body && (
        <div className="course-excerpt">
          <span>معرفی کوتاه رویداد</span>
          {course?.body && parse(course?.body)}
        </div>
      )}
    </div>
  );
};

export default CourseCheckoutInfo;

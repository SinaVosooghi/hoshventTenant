import { memo } from "react";
import { BookTwoTone, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  message,
  notification,
  Tooltip,
  Typography,
} from "antd";
import Image from "next/image";
import Course from "../../src/datamodel/Course";
import parse from "html-react-parser";
import { getUserFromCookie, percentCalculate } from "../../src/util/utils";
import { useEffect, useState } from "react";
import { User } from "../../src/datamodel";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import { siteCreateFavorite } from "../../src/shared/apollo/graphql/mutations/favorite/create";
import { siteGetEventApi } from "../../src/shared/apollo/graphql/queries/event/siteGetEventApi";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../src/shared/store";
import { siteCreateLike } from "../../src/shared/apollo/graphql/mutations/like/create";
import currencyType from "../../src/components/currency";
import Link from "next/link";
import Event from "../../src/datamodel/Event";

const { Paragraph } = Typography;

const EventInfo = ({
  event,
  checkData,
  loading,
}: {
  event: Event;
  checkData: { alreadyBought: boolean };
  loading: boolean;
}) => {
  const dispatch = useDispatch<Dispatch>();

  const router = useRouter();
  const [lessonsCount, setLessonsCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const [favorite, { loading: favoriteLoading }] = useMutation(
    siteCreateFavorite,
    {
      refetchQueries: [siteGetEventApi],
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        message.success(`"${event?.title}"  به لیست علاقمندی ها اضافه شد.`);
      },
      onError: (error) => {
        if (error.message === "Already added") {
          message.error("قبلا رای داده اید");
        } else if (error.message === "Unauthorized") {
          notification.error({
            message: "خطا",
            description: "برای رای دادن، وارد حساب کاربری شوید",
          });
        } else {
          message.error("خطایی رخ داده است");
        }
      },
    }
  );

  const [like, { loading: likeloading }] = useMutation(siteCreateLike, {
    refetchQueries: [siteGetEventApi],
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (error.message === "Already added") {
        message.error("قبلا رای داده اید");
      } else if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "برای رای دادن، وارد حساب کاربری شوید",
        });
      } else {
        message.error("خطایی رخ داده است");
      }
    },
  });

  const buyCourse = () => {
    dispatch.eventCheckoutModel.addCourse(event);
    router.push("/eventcheckout");
  };

  const clickFavorite = () => {
    favorite({
      variables: {
        input: {
          event: event?.id,
        },
      },
    });
  };

  const clickLike = () => {
    like({
      variables: {
        input: {
          event: event?.id,
          like: true,
        },
      },
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  useEffect(() => {
    let i = 0;
    event?.sections.map((section) => {
      // @ts-ignore
      section.lessons.map((lesson) => i++);
    });
    setLessonsCount(i);
  }, [event]);

  const goToPanel = () => {
    router.push(`/panel/events/view/?id=${event?.id}`);
  };

  return (
    <div id="event-info">
      <span className="divider">
        <div>
          <img src="/assets/icons/music-note.png" alt="rasta" />
        </div>
      </span>

      <div className="event-price-container">
        {event?.offprice && (
          <div className="event-off-price">
            <p>{event?.offprice.toLocaleString()}</p>
            <span>{percentCalculate(event?.offprice, event?.price)}%</span>
          </div>
        )}
        <div className="event-price">
          {event?.price ? (
            <>
              {event?.price.toLocaleString()} <small>{currencyType()} </small>
            </>
          ) : (
            "رایگان"
          )}
        </div>
        {user?.type !== "user" ? (
          <Tooltip title={"فقط کاربران هنرجو اجازه خرید رویداد را دارند!"}>
            <Button disabled block className="buy-disabled buy-btn">
              خرید رویداد
            </Button>
          </Tooltip>
        ) : //@ts-ignore
        checkData?.checkCourseApi.alreadyBought ? (
          <Tooltip title={"شما این رویداد را قبلا خریداری کرده اید"}>
            <Button
              disabled={!user}
              block
              loading={loading}
              onClick={goToPanel}
              className={`checkout-event-btn`}
            >
              مشاهده جزییات
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={!user ? "جهت خرید رویداد وارد حساب کاربری شوید" : ""}>
            <Button
              disabled={!user}
              block
              loading={loading}
              onClick={buyCourse}
              className={`${!user ? "buy-disabled" : ""} buy-btn`}
            >
              خرید رویداد
            </Button>
          </Tooltip>
        )}
        {}
      </div>

      <div className="event-total">
        {event?.duration && (
          <div className="event-time">
            <Image
              src="/assets/clock-circle.png"
              alt="rasta"
              width={41}
              height={41}
            />
            {event?.duration ?? ""}
          </div>
        )}

        <div className="event-lessons">
          <p>{lessonsCount}</p>
          جلسه
        </div>
      </div>

      <div className="event-results">
        <Button
          className="event-likes"
          onClick={clickLike}
          loading={likeloading}
        >
          <Image src="/assets/likes.png" alt="rasta" width={20} height={19} />
          {event?.like?.length ?? 0}
        </Button>
        <div className="event-comments">
          <Image
            src="/assets/comments.png"
            alt="rasta"
            width={20}
            height={20}
          />
          0
        </div>
        <div className="event-alerts">
          <Button
            className="event-bookmark"
            onClick={clickFavorite}
            loading={favoriteLoading}
          >
            <BookTwoTone twoToneColor="#B6BAC5" rev={undefined} />
            {event?.favorite?.length}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(EventInfo);

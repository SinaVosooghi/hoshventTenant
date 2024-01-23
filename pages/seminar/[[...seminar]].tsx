import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Tooltip, notification } from "antd";
import moment from "jalali-moment";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";
import { siteGetSeminarApi } from "../../src/shared/apollo/graphql/queries/seminar/siteGetSeminarApi";
import currencyType from "../../src/components/currency";
import { getUserFromCookie } from "../../src/util/utils";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../src/shared/store";
import { User } from "../../src/datamodel";
require("./style.less");

const PlanItem = () => {
  const router = useRouter();
  const { seminar } = router.query;
  const dispatch = useDispatch<Dispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [options, setOptions] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const { data: seminarApi } = useQuery(siteGetSeminarApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: seminar && seminar[0] },
  });

  const addToCart = () => {
    notification.success({
      message: `محصول اضافه شد`,
      description: (
        <>محصول {seminarApi?.seminarApi?.title} به سبد خرید شما اضافه شد.</>
      ),
    });

    dispatch.cart.addItem({
      ...seminarApi?.seminarApi,
      selectedOptions,
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const renderButton = () => {
    var pastDate = moment(seminarApi?.seminarApi.end_date);

    const isPassed = moment().diff(pastDate, "days");

    if (isPassed > 1) {
      return <Button disabled>این رویداد پایان یافته</Button>;
    } else {
      return (
        <Tooltip title={!user ? "جهت خرید وارد حساب کاربری شوید" : ""}>
          <Button onClick={() => addToCart()} disabled={!user}>
            افزودن به سبد خرید
            <img src="/assets/icons/cart.png" width={18} alt="arrow" />
          </Button>
        </Tooltip>
      );
    }
  };

  const handleChange = (value: string[]) => {
    const find = value.map((o) => {
      return options.find((op) => op.value === o);
    });

    setSelectedOptions(find);
  };

  useEffect(() => {
    if (seminarApi?.seminarApi.services.length) {
      const services = [...seminarApi?.seminarApi.services];
      const serviceOptions = services.map((service) => {
        return {
          label: service.title,
          value: service.id,
          price: service.price,
        };
      });
      setOptions(serviceOptions);
    }
  }, [seminarApi]);

  return (
    <>
      <NextSeo
        title={seminarApi?.seminarApi.title}
        description={seminarApi?.seminarApi?.seobody}
      />
      <div id="event">
        <MainBreadCrumb
          secondItem="رویداد ها"
          activeItem={seminarApi?.seminarApi?.title}
        />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="event"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="event-container">
            <Fade>
              <div id="event-card">
                <Row gutter={[24, 24]}>
                  <Col md={10} xs={24} className="event-content">
                    <div className="event-title">
                      <h1>{seminarApi?.seminarApi?.title}</h1>
                      <p>{seminarApi?.seminarApi?.subtitle}</p>
                      <span className="type-pill">امکانات پایه</span>
                      {seminarApi?.seminarApi.seobody &&
                        parse(seminarApi?.seminarApi.seobody)}

                      <div className="item-button">
                        {renderButton()}

                        <div className="item-price">
                          {seminarApi?.seminarApi?.price && (
                            <p className="item-regular-price">
                              {seminarApi?.seminarApi?.price?.toLocaleString()}
                            </p>
                          )}
                          <span className="item-currency">
                            {seminarApi?.seminarApi?.price
                              ? currencyType()
                              : "رایگان"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="event-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          seminarApi?.seminarApi?.image
                        }')`,
                      }}
                    ></div>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>

          <Col span={20}>
            <Fade>
              <div className="event-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(seminarApi?.seminarApi?.updated)
                      .locale("fa")
                      .format("D MMM YYYY")}
                  </span>
                </div>
              </div>
              <div className="event-body">
                {seminarApi?.seminarApi?.body ? (
                  parse(seminarApi?.seminarApi?.body)
                ) : (
                  <></>
                )}
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PlanItem;

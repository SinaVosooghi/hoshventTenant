import { useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  SelectProps,
  Tooltip,
  notification,
} from "antd";
import moment from "jalali-moment";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";
import { getUserFromCookie } from "../../src/util/utils";
import currencyType from "../../src/components/currency";

import { useDispatch } from "react-redux";
import { Dispatch } from "../../src/shared/store";
import { useEffect, useState } from "react";
import { User } from "../../src/datamodel";
import { siteGetService } from "../../src/shared/apollo/graphql/queries/services/siteGetService";

require("./style.less");

const Service = () => {
  const router = useRouter();
  const { service } = router.query;
  const dispatch = useDispatch<Dispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [options, setOptions] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const { data: serviceApi } = useQuery(siteGetService, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { id: service && parseInt(service[0]) },
  });

  const addToCart = () => {
    notification.success({
      message: `محصول اضافه شد`,
      description: (
        <>محصول {serviceApi?.serviceApi?.title} به سبد خرید شما اضافه شد.</>
      ),
    });

    dispatch.cart.addItem({
      ...serviceApi?.serviceApi,
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const renderButton = () => {
    var pastDate = moment(serviceApi?.serviceApi.end_date);

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

  return (
    <>
      <NextSeo
        title={serviceApi?.serviceApi?.title}
        description={serviceApi?.serviceApi?.seobody}
      />
      <div id="service">
        <MainBreadCrumb
          secondItem="سرویس ها"
          activeItem={serviceApi?.serviceApi?.title}
        />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="service"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="service-container">
            <Fade>
              <div id="service-card">
                <Row>
                  <Col md={10} xs={24} className="service-content">
                    <div className="service-title">
                      <h1>{serviceApi?.serviceApi?.title}</h1>
                      <p>{serviceApi?.serviceApi?.hall?.title}</p>

                      <div className="service-dates">
                        {serviceApi?.serviceApi?.start_date && (
                          <div className="service-status">
                            <div className="status-item">
                              تاریخ شروع
                              <span>
                                {moment(serviceApi?.serviceApi?.start_date)
                                  .locale("fa")
                                  .format("YYYY MMM D")}{" "}
                                ساعت
                                {moment(serviceApi?.serviceApi?.start_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                        {serviceApi?.serviceApi?.end_date && (
                          <div className="service-status">
                            <div className="status-item">
                              تاریخ پایان
                              <span>
                                {moment(serviceApi?.serviceApi?.end_date)
                                  .locale("fa")
                                  .format("YYYY MMM D")}{" "}
                                ساعت
                                {moment(serviceApi?.serviceApi?.end_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="item-button">
                        {renderButton()}

                        <div className="item-price">
                          {serviceApi?.serviceApi?.price && (
                            <p className="item-regular-price">
                              {serviceApi?.serviceApi?.price?.toLocaleString()}
                            </p>
                          )}
                          <span className="item-currency">
                            {serviceApi?.serviceApi?.price
                              ? currencyType()
                              : "رایگان"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="service-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          serviceApi?.serviceApi?.image
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
              <div className="service-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(serviceApi?.serviceApi?.updated)
                      .locale("fa")
                      .format("D MMM YYYY")}
                  </span>
                </div>
              </div>
              <div className="service-body">
                {serviceApi?.serviceApi?.body ? (
                  parse(serviceApi?.serviceApi?.body)
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

export default Service;

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
import { siteGetWorkshopApi } from "../../src/shared/apollo/graphql/queries/workshop/siteGetWorkshopApi";

require("./style.less");

const Workshop = () => {
  const router = useRouter();
  const { workshop } = router.query;
  const dispatch = useDispatch<Dispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [options, setOptions] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const { data: workshopApi, loading } = useQuery(siteGetWorkshopApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: { slug: workshop && workshop[0] },
  });

  const addToCart = () => {
    notification.success({
      message: `محصول اضافه شد`,
      description: (
        <>محصول {workshopApi?.workshopApi?.title} به سبد خرید شما اضافه شد.</>
      ),
    });

    dispatch.cart.addItem({
      ...workshopApi?.workshopApi,
      selectedOptions,
    });
  };

  useEffect(() => {
    if (getUserFromCookie()) {
      setUser(getUserFromCookie());
    }
  }, []);

  const renderButton = () => {
    var pastDate = moment(workshopApi?.workshopApi.end_date);

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
      return options.find((op: any) => op.value === o);
    });

    setSelectedOptions(find);
  };

  useEffect(() => {
    if (workshopApi?.workshopApi.services.length) {
      const services = [...workshopApi?.workshopApi.services];
      const serviceOptions = services.map((service) => {
        return {
          label: service.title,
          value: service.id,
          price: service.price,
        };
      });
      setOptions(serviceOptions);
    }
  }, [workshopApi]);

  return (
    <>
      <NextSeo
        title={workshopApi?.workshopApi?.title}
        description={workshopApi?.workshopApi?.seobody}
      />
      <div id="workshop">
        <MainBreadCrumb
          secondItem="رویداد ها"
          activeItem={workshopApi?.workshopApi?.title}
        />
        <Fade>
          <img
            src="/assets/about/circles.png"
            alt="workshop"
            className="circles"
          />
        </Fade>
        <Row justify="center">
          <Col md={20} xs={24} id="workshop-container">
            <Fade>
              <Card
                id="workshop-card"
                bodyStyle={{ padding: 0 }}
                loading={loading}
              >
                <Row>
                  <Col md={10} xs={24} className="workshop-content">
                    <div className="workshop-title">
                      <h1>{workshopApi?.workshopApi?.title}</h1>
                      <p>{workshopApi?.workshopApi?.hall?.title}</p>

                      <div className="workshop-dates">
                        {workshopApi?.workshopApi?.start_date && (
                          <div className="workshop-status">
                            <div className="status-item">
                              تاریخ شروع
                              <span>
                                {moment(workshopApi?.workshopApi?.start_date)
                                  .locale("fa")
                                  .format("D MMM YYYY")}{" "}
                                ساعت
                                {moment(workshopApi?.workshopApi?.start_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                        {workshopApi?.workshopApi?.end_date && (
                          <div className="workshop-status">
                            <div className="status-item">
                              تاریخ پایان
                              <span>
                                {moment(workshopApi?.workshopApi?.end_date)
                                  .locale("fa")
                                  .format("D MMM YYYY")}{" "}
                                ساعت
                                {moment(workshopApi?.workshopApi?.end_date)
                                  .locale("fa")
                                  .format("H:mm")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="workshop-services">
                        <h4>انتخاب خدمات</h4>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="انتخاب خدمات"
                          onChange={handleChange}
                          options={options}
                        />
                      </div>

                      <div className="item-button">
                        {renderButton()}

                        <div className="item-price">
                          {workshopApi?.workshopApi?.price && (
                            <p className="item-regular-price">
                              {workshopApi?.workshopApi?.price?.toLocaleString()}
                            </p>
                          )}
                          <span className="item-currency">
                            {workshopApi?.workshopApi?.price
                              ? currencyType()
                              : "رایگان"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={14} xs={24}>
                    <div
                      className="workshop-image"
                      style={{
                        backgroundImage: `url('${
                          process.env.NEXT_PUBLIC_SITE_URL +
                          "/" +
                          workshopApi?.workshopApi?.image
                        }')`,
                      }}
                    ></div>
                  </Col>
                </Row>
              </Card>
            </Fade>
          </Col>

          <Col span={20}>
            <Fade>
              <div className="workshop-status">
                <div className="status-item">
                  آخرین به روزرسانی
                  <span>
                    {moment(workshopApi?.workshopApi?.updated)
                      .locale("fa")
                      .format("D MMM YYYY")}
                  </span>
                </div>
              </div>
              <div className="workshop-body">
                {workshopApi?.workshopApi?.body ? (
                  parse(workshopApi?.workshopApi?.body)
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

export default Workshop;

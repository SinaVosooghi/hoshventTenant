import { Button, Col, Row, Space } from "antd";
import Image from "next/dist/client/image";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import Service from "../../../datamodel/Service";
import parse from "html-react-parser";

require("./style.less");
const HomeServices = ({
  services,
  title,
  subtitle,
}: {
  services: [Service];
  title?: any;
  subtitle?: string;
}) => {
  return (
    <div id="home-services">
      <Slide bottom>
        <Row justify="center">
          <Col md={20} xs={24}>
            <Row className="services-container">
              <Col md={24}>
                <div className="services-content">
                  <div className="services-title">
                    <h1>
                      {title ? (
                        title
                      ) : (
                        <>
                          ویژگی های <strong> ما</strong>
                        </>
                      )}
                    </h1>
                    <small>
                      {subtitle ? subtitle : " چرا ما را انتخاب کنید؟"}
                    </small>
                  </div>
                  <Row className="services-list" gutter={[36, 136]}>
                    {services?.map((service: Service) => {
                      return (
                        <Col md={8} className="service-item" key={service.slug}>
                          <div className="service">
                            <Image
                              src="/assets/services-icon.png"
                              height={124}
                              width={124}
                              alt="services"
                            />
                            <h2>{service?.title}</h2>
                            {service?.body && parse(service?.body)}
                          </div>
                          <span></span>
                        </Col>
                      );
                    })}
                    <Fade>
                      <img
                        src="/assets/button-pattern.png"
                        alt="event"
                        className="dots"
                      />
                    </Fade>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Slide>
    </div>
  );
};

export default HomeServices;

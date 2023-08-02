import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import Link from "next/link";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";
import { siteGetPlans } from "../../src/shared/apollo/graphql/queries/plans/siteGetPlans";
import Plan from "../../src/datamodel/Plan";
import PlanItem from "../../src/components/plans/planItem";

require("./style.less");

const Plans = ({}) => {
  const { data: plansApi, loading: planLoading } = useQuery(siteGetPlans, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    // @ts-ignore
    variables: {
      input: {
        limit: 32,
        skip: 0,
        status: true,
      },
    },
  });

  return (
    <>
      <NextSeo title={"نسخه ها و قیمت ها"} description={"نسخه ها و قیمت ها"} />
      <div id="plans">
        <MainBreadCrumb activeItem="نسخه ها و قیمت ها" />

        <Row justify="center">
          <Col md={20} xs={24}>
            <div className="page-title">
              <Fade>
                <img
                  src="/assets/page-title.png"
                  alt="نسخه ها و قیمت ها"
                  className="page-title-icon"
                />
                <h1>
                  پکیج ها <br />
                  <strong>با قیمت گذاری</strong>
                </h1>
              </Fade>
            </div>
          </Col>
          <Col md={20} xs={24} id="plans-container">
            <Fade>
              <div id="plans-card">
                <Row>
                  <Col md={24} xs={24} className="plans-content">
                    <Row className="plans">
                      {plansApi?.plansApi?.plans?.map((plan: Plan) => (
                        <Link href={`/plan/${plan?.slug}`} key={plan.id}>
                          <PlanItem plan={plan} />
                        </Link>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Plans;

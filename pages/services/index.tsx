import { AppstoreOutlined } from "@ant-design/icons";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Image,
  Input,
  List,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainBreadCrumb from "../../src/components/breadcrumb";
import CourseItem from "../../src/components/courseItem/courseItem";
import Course from "../../src/datamodel/Course";
import { siteGetCategories } from "../../src/shared/apollo/graphql/queries/category/siteGetCategories";
import Sidebar from "./sidebar";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade, Slide } from "react-reveal";
import { siteGetWorkshops } from "../../src/shared/apollo/graphql/queries/workshop/siteGetWorkshops";
import WorkshopItem from "../../src/components/plans/workshopItem";
import Workshop from "../../src/datamodel/Workshop";
import { siteGetServices } from "../../src/shared/apollo/graphql/queries/services/siteGetServices";
import ServiceItem from "../../src/components/plans/serviceItem";
import Service from "../../src/datamodel/Service";
require("./style.less");

const Courses = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(true);
  const [value, setValue] = useState("latest");
  const [search, setSearch] = useState();

  const [priceType, setPriceType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [featured, setFeatured] = useState("all");
  const [status, setStatus] = useState("all");

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const onSearchChange = (e: RadioChangeEvent) => {
    setSearch(e.target.value);
  };

  const [getItems, { data: servicesApi, loading }] = useLazyQuery(
    siteGetServices,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: search,
          status: statusValue ?? null,
          // @ts-ignore
          siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  }, [
    currentPage,
    featured,
    getItems,
    priceType,
    rowsPerPage,
    search,
    statusValue,
    value,
    status,
  ]);

  return (
    <>
      <NextSeo title={"خدمات "} description={"آخرین خدمات  "} />
      <MainBreadCrumb activeItem="خدمات " />
      <div id="events">
        <Row justify="center">
          <Col md={20} xs={24}>
            <Fade>
              <div id="events-filter">
                <Row>
                  <Col md={24}>
                    <div className="section-title">
                      <span className="icon-btn">
                        <AppstoreOutlined rev={undefined} />
                      </span>
                      {selectedCategory ? (
                        <h2>
                          دسته بندی های
                          <br /> <strong>{selectedCategory}</strong>
                        </h2>
                      ) : (
                        <h2>
                          جدیدترین
                          <br /> <strong>خدمات</strong>
                        </h2>
                      )}
                    </div>
                    <Input
                      size="large"
                      placeholder=" عنوان خدمات "
                      // @ts-ignore
                      onChange={onSearchChange}
                      suffix={<Button loading={loading}>جستجو</Button>}
                      prefix={
                        <Image
                          src="/assets/icons/search-light.png"
                          height={20}
                          width={20}
                          alt="search"
                        />
                      }
                    />
                    <Space className="events-filter-sort" size={40}>
                      <p>مرتب سازی براساس:</p>
                      <Radio.Group
                        onChange={onChange}
                        value={value}
                        size="large"
                      >
                        <Radio value={"latest"}>جدیدترین </Radio>
                        <Radio value={"oldest"}>قدیمی ترین </Radio>
                        <Radio value={"lowest"}> ارزان ترین</Radio>
                        <Radio value={"highest"}> گران ترین </Radio>
                        <Radio value={"lastupdate"}> آخرین بروزرسانی </Radio>
                      </Radio.Group>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
        <Fade>
          <Row justify="center" id="events-container" gutter={[30, 30]}>
            <Col md={20} xs={24} className="top-order">
              <List
                loading={loading}
                dataSource={servicesApi?.servicesApi?.services}
                grid={{
                  // @ts-ignore
                  gutter: [30, 55],
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                pagination={{
                  showLessItems: true,
                  pageSize: 9,
                  hideOnSinglePage: true,
                }}
                renderItem={(item: Service) => (
                  <List.Item key={item.id}>
                    <Link href={`/service/${item.id}`}>
                      <ServiceItem service={item} />
                    </Link>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Fade>
      </div>
    </>
  );
};

export default Courses;

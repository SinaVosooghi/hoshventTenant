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

  const [getItems, { data: workshopsApi, loading }] = useLazyQuery(
    siteGetWorkshops,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const { data: categoriesApi } = useQuery(siteGetCategories, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 14,
        skip: 0,
        status: true,
        type: "workshop",
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: 10,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: search,
          status: statusValue ?? null,
          sort: value,
          price: priceType,
          ...(featured !== "all" && { featured: featured }),
          ...(status !== "all" && { status: status }),
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
      <NextSeo title={"رویداد ها"} description={"آخرین رویداد ها "} />
      <MainBreadCrumb activeItem="رویداد ها" />
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
                          <br /> <strong>رویداد ها</strong>
                        </h2>
                      )}
                    </div>
                    <Input
                      size="large"
                      placeholder=" عنوان رویداد "
                      // @ts-ignore
                      onChange={onSearchChange}
                      suffix={<Button loading={loading}>جستجو</Button>}
                      prefix={
                        <Image
                          src="/assets/icons/search-light.png"
                          height={20}
                          width={20}
                          preview={false}
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
                        className="category-filters"
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
            <Col md={5} xs={24} className="low-order">
              <Sidebar
                setPriceType={setPriceType}
                priceType={priceType}
                categories={categoriesApi?.categoriesApi?.categories}
                featured={featured}
                setFeatured={setFeatured}
                setSelectedCategory={setSelectedCategory}
                onStatusChange={setStatus}
                status={status}
              />
            </Col>

            <Col md={15} xs={24} className="top-order">
              <List
                loading={loading}
                dataSource={workshopsApi?.workshopsApi?.workshops}
                grid={{
                  // @ts-ignore
                  gutter: [30, 55],
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                pagination={{
                  showLessItems: true,
                  pageSize: 9,
                  hideOnSinglePage: true,
                }}
                renderItem={(item: Workshop) => (
                  <List.Item key={item.id}>
                    <Link href={`/workshop/${item.slug}`}>
                      <WorkshopItem workshop={item} />
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

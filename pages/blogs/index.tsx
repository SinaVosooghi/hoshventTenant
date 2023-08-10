import {
  Button,
  Col,
  Input,
  List,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
} from "antd";
import MainBreadCrumb from "../../src/components/breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import Image from "next/image";
import { AppstoreFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import BlogItem from "../../src/components/blogItem/courseItem";
import Link from "next/link";
import { useLazyQuery, useQuery } from "@apollo/client";
import { siteGetBlogs } from "../../src/shared/apollo/graphql/queries/blog/siteGetBlogs";
import Blog from "../../src/datamodel/Blog";
import Sidebar from "./sidebar";
import { siteGetCategories } from "../../src/shared/apollo/graphql/queries/category/siteGetCategories";
import { NextSeo } from "next-seo";
// @ts-ignore
import { Fade } from "react-reveal";

require("./style.less");

const Blogs = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [value, setValue] = useState("latest");
  const [search, setSearch] = useState();

  const [category, setCategory] = useState("all");
  const [featured, setFeatured] = useState("all");

  const params = {
    autoplay: {
      delay: 5500,
    },
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const { data } = useQuery(siteGetBlogs, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
    variables: {
      input: {
        limit: 5,
        skip: 0,
        status: true,
        featured: true,
      },
    },
  });

  const { data: categoriesApi, loading: categoriesLoading } = useQuery(
    siteGetCategories,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        input: {
          limit: 14,
          skip: 0,
          type: "blog",
        },
      },
    }
  );

  const [getItems, { data: blogsApi, loading }] = useLazyQuery(siteGetBlogs, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
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
          category: category,
          ...(featured !== "all" && { featured: featured }),
        },
      },
    });
  }, [
    category,
    currentPage,
    featured,
    getItems,
    rowsPerPage,
    search,
    statusValue,
    value,
  ]);

  return (
    <>
      <NextSeo title="مقاله ها" />
      <MainBreadCrumb activeItem="وبلاگ" />
      <div id="blogs">
        <Row justify="center">
          {data?.blogsApi?.blogs.length ? (
            <Col md={20} xs={24} id="blogs-container">
              <div className="blogs-slider">
                <Swiper
                  className="blogs-main-swiper"
                  {...params}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                >
                  {data?.blogsApi?.blogs?.map((blog: Blog) => (
                    <SwiperSlide key={blog.id}>
                      <div
                        className="blogs-slider-item"
                        style={{
                          backgroundImage: `url('${
                            process.env.NEXT_PUBLIC_SITE_URL + "/" + blog.image
                          }')`,
                        }}
                      >
                        <div className="blogs-slider-content">{blog.title}</div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
          ) : (
            <></>
          )}

          <Col md={20} xs={24}>
            <Fade>
              <div id="blogs-filter">
                <Row>
                  <Col md={24}>
                    <div className="section-title">
                      <span className="icon-btn">
                        <AppstoreFilled rev={undefined} />
                      </span>
                      {selectedCategory ? (
                        <h2>
                          دسته بندی های
                          <br /> <strong>{selectedCategory}</strong>
                        </h2>
                      ) : (
                        <h2>
                          جدیدترین
                          <br /> <strong> مقالات</strong>
                        </h2>
                      )}
                    </div>
                    <Input
                      size="large"
                      placeholder="برای مثال :  رویداد سه تار"
                      suffix={<Button>جستجو</Button>}
                      onChange={onSearchChange}
                      prefix={
                        <Image
                          src="/assets/icons/search-light.png"
                          height={20}
                          width={20}
                          alt="search"
                        />
                      }
                    />
                    <Space className="blogs-filter-sort" size={40}>
                      <p>مرتب سازی براساس:</p>
                      <Radio.Group
                        onChange={onChange}
                        value={value}
                        size="large"
                      >
                        <Radio value={"latest"}>جدیدترین </Radio>
                        <Radio value={"oldest"}>قدیمی ترین </Radio>
                        <Radio value={"lastupdate"}> آخرین بروزرسانی </Radio>
                      </Radio.Group>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Fade>
          </Col>
        </Row>
        <Row justify="center" id="blogs-container" gutter={[30, 30]}>
          <Col md={5} xs={24} className="low-order">
            <Sidebar
              categories={categoriesApi?.categoriesApi?.categories}
              category={category}
              setCategory={setCategory}
              featured={featured}
              setFeatured={setFeatured}
              setSelectedCategory={setSelectedCategory}
            />
          </Col>
          <Col md={15} xs={24} className="top-order">
            <List
              id="blogs-list"
              dataSource={blogsApi?.blogsApi?.blogs}
              loading={loading}
              grid={{
                // @ts-ignore
                gutter: [30, 55],
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              pagination={{
                showLessItems: true,
                pageSize: 9,
                hideOnSinglePage: true,
              }}
              renderItem={(item: Blog) => (
                <List.Item key={item.id}>
                  <Link href={`/blog/${item.slug}`}>
                    <BlogItem blog={item} />
                  </Link>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Blogs;

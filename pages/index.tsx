import { useQuery } from "@apollo/client";
import MainBreadCrumb from "../src/components/breadcrumb";
import CategoriesSlider from "../src/components/categoriesSlider";
import HomeAbout from "../src/components/homepage/about";
import HomeMainSlider from "../src/components/homepage/homeSlider";
import LatestProducts from "../src/components/sections/products/products";
import { NextSeo } from "next-seo";
import { siteGetEventsApi } from "../src/shared/apollo/graphql/queries/event/siteGetEventsApi";
import LatestWorkShops from "../src/components/sections/latest/latest";
import { siteGetProductsApi } from "../src/shared/apollo/graphql/queries/product/siteGetProductsApi";
import useGetSetting from "../src/hooks/useGetSetting";
import Setting from "../src/datamodel/Setting";
import { Col, Row } from "antd";
import HomeServices from "../src/components/homepage/services";
import { siteGetServices } from "../src/shared/apollo/graphql/queries/services/siteGetServices";
import EventSlider from "../src/components/sections/featured/featured";
import PlanSlider from "../src/components/plans/plans";

export default function Home() {
  const { data }: { data: Setting } = useGetSetting();

  const { data: eventsApi, loading } = useQuery(siteGetEventsApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 9,
        skip: 0,
        featured: true,
      },
    },
  });

  const { data: services } = useQuery(siteGetServices, {
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        limit: 6,
        skip: 0,
        status: true,
      },
    },
  });

  const { data: productsApi, loading: ProductsLoading } = useQuery(
    siteGetProductsApi,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        input: {
          limit: 9,
          skip: 0,
        },
      },
    }
  );

  return (
    <>
      <NextSeo
        title={data?.title ?? "سامانه رویداد"}
        description={data?.seodescription}
      />
      <HomeMainSlider />
      <HomeAbout />
      <EventSlider
        items={eventsApi?.eventsApi?.events}
        loading={loading}
        title="رویداد های"
        subTitle="برگزار شده"
      />

      {/* Service components */}
      <HomeServices services={services?.servicesApi?.services} />

      <PlanSlider loading={loading} title="پکیج ها" subTitle="با قیمت گذاری" />

      <CategoriesSlider />
    </>
  );
}

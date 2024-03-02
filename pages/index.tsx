import { useQuery } from "@apollo/client";
import CategoriesSlider from "../src/components/categoriesSlider";
import HomeAbout from "../src/components/homepage/about";
import HomeMainSlider from "../src/components/homepage/homeSlider";
import { NextSeo } from "next-seo";
import { siteGetEventsApi } from "../src/shared/apollo/graphql/queries/event/siteGetEventsApi";
import useGetSetting from "../src/hooks/useGetSetting";
import Setting from "../src/datamodel/Setting";
import HomeServices from "../src/components/homepage/services";
import { siteGetServices } from "../src/shared/apollo/graphql/queries/services/siteGetServices";
import EventSlider from "../src/components/sections/featured/featured";
import PlanSlider from "../src/components/plans/plans";
import { siteGetSminarsApi } from "../src/shared/apollo/graphql/queries/seminar/siteGetSeminarsApi";

export default function Home() {
  const { data }: { data: Setting } = useGetSetting();

  const { data: seminarsApi, loading } = useQuery(siteGetSminarsApi, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 9,
        skip: 0,
        featured: true,
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
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
        // @ts-ignore
        siteid: parseInt(process.env.NEXT_PUBLIC_SITE),
      },
    },
  });

  return (
    <>
      <NextSeo
        title={data?.title ?? "سامانه رویداد"}
        description={data?.seodescription}
      />
      <HomeMainSlider />
      <HomeAbout />
      <EventSlider
        items={seminarsApi?.seminarsApi?.seminars}
        loading={loading}
        title="رویدادهای"
        subTitle="جانبی"
      />

      {/* Service components */}
      <HomeServices services={services?.servicesApi?.services} />

      <PlanSlider
        loading={loading}
        title="ورکشاپ ها"
        subTitle="با قیمت گذاری"
      />

      <CategoriesSlider />
    </>
  );
}

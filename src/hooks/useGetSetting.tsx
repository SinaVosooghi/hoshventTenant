import { useQuery } from "@apollo/client";
import { siteGetSetting } from "../shared/apollo/graphql/queries/setting/siteGetSetting";
import { siteGetSite } from "../shared/apollo/graphql/queries/site/siteGetSetting";

const useGetSetting = () => {
  const { data, loading } = useQuery(siteGetSite, {
    notifyOnNetworkStatusChange: true,
    initialFetchPolicy: "cache-first",
    fetchPolicy: "cache-first",
    variables: {
      // @ts-ignore
      id: parseInt(process.env.NEXT_PUBLIC_SITE)
    }
  });

  return { data: data?.getSite, loading };
};

export default useGetSetting;

import { useQuery } from "@apollo/client";
import { siteGetSetting } from "../shared/apollo/graphql/queries/setting/siteGetSetting";

const useGetSetting = () => {
  const { data, loading } = useQuery(siteGetSetting, {
    notifyOnNetworkStatusChange: true,
    initialFetchPolicy: "cache-first",
    fetchPolicy: "cache-first",
  });

  return { data: data?.getSetting, loading };
};

export default useGetSetting;

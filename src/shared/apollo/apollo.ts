import {
  ApolloClient,
  createHttpLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";
import { User } from "../../datamodel";

let apolloClient: ApolloClient<NormalizedCacheObject>;
const URL =
  process.env.NEXT_PUBLIC_BASE_API || "https://api.rastaavan.net/graphql";

const httpLink = createHttpLink({
  uri: URL,
});

const authLink = setContext((_, { headers }) => {
  let userCookie: User | null = null;
  if (getCookie("user")) {
    // @ts-ignore
    userCookie = JSON.parse(getCookie("user"));
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${userCookie?.access_token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

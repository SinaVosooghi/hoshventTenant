import { createModel } from "@rematch/core";
import { RootState } from "..";
import { User } from "../../../datamodel";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";

const initialUser = () => {
  const item = getCookie("user");
  //** Parse stored json or if none return initialValue
  // @ts-ignore
  return item ? JSON.parse(item) : {};
};

const DEFAULT_FILTER_STATE = {
  user: initialUser(),
};

type Modify<T, R> = Omit<T, keyof R> & R;

type MyType = Modify<
  typeof DEFAULT_FILTER_STATE,
  {
    user: User | null;
  }
>;

const defaultStateWithType: MyType = DEFAULT_FILTER_STATE;

const usersModel = createModel<RootState>()({
  effects: {}, // initial state
  reducers: {
    addUser(state, user) {
      return { ...state, user };
    },
    handleLogin: (state, action) => {
      state.user = action;
      setCookie("user", JSON.stringify(action));
    },
    handleLogout: (state) => {
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem("user");
    },
  },
  state: defaultStateWithType,
});

export default usersModel;

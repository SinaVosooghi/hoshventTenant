import {
  CookieValueTypes,
  getCookie,
  removeCookies,
  setCookie,
} from "cookies-next";
import { User } from "../datamodel";

export const checkLogin = () => {
  const user: CookieValueTypes = getCookie("user");

  if (user) return true;
  return false;
};

export const handleLogin = (data: any) => {
  setCookie("user", JSON.stringify(data), { maxAge: 864000000 });
  return true;
};

export const getUserFromCookie = (): User | null => {
  if (getCookie("user")) {
    // @ts-ignore
    const user: User = JSON.parse(getCookie("user"));
    return user;
  }
  return null;
};

export const handleLogout = () => {
  removeCookies("user");
  return true;
};

export const percentCalculate = (oldPriceNum: number, newPriceNum: number) => {
  let percent = oldPriceNum - newPriceNum;
  let percent1 = percent / oldPriceNum;
  let percent2 = percent1 * 100;
  // @ts-ignore
  let finalPercent = parseFloat(percent2).toFixed(0);

  return finalPercent;
};

export const renderCurrency = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "IRR":
      return "تومان";
    case "EUR":
      return "€";
    default:
      return "تومان";
  }
};

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    [{ direction: "rtl" }], // this is rtl support
  ],
};

import { getCookie } from "cookies-next";

const currencyType = () => {
  let currency;
  if (getCookie("currency")) {
    // @ts-ignore
    currency = JSON.parse(getCookie("currency"));
  }

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

export default currencyType;

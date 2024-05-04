import { useMutation } from "@apollo/client";
import { FormEvent } from "react";
import { siteCreatePayment } from "../shared/apollo/graphql/mutations/payment/create";
import { notification } from "antd";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../shared/store";

function usePayment({
  itemId,
  total,
  setLoading,
  items,
  type,
}: {
  itemId?: number;
  total: number;
  setLoading: any;
  items?: any[];
  type: "event" | "shop";
}) {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch>();
  const { discount } = useSelector((state: RootState) => state.cart);

  const [pay] = useMutation(siteCreatePayment, {
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ doPayment }) => {
      setLoading(false);

      if (doPayment) {
        notification.success({ message: "خرید با موفقیت انجام شد!" });

        dispatch.cart.emptyCart();
        dispatch.cart.removeDiscount();
        location.replace(doPayment);
      } else {
        notification.error({ message: "خطا هنگام خرید رویداد" });
      }
    },
    onError: (error) => {
      setLoading(false);
      if (error.message === "Already added") {
        notification.error({
          message: "خطا",
          description: "شما این رویداد را قبلا رزرو کرده اید",
        });
      } else if (error.message === "Unauthorized") {
        notification.error({
          message: "خطا",
          description: "شما از حساب کاربریتان خارج شدید، مجدد وارد شوید!",
        });
      } else {
        notification.error({ message: "Error", description: error.message });
      }
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    var host = window.location.protocol + "//" + window.location.host;
    setLoading(true);

    const amountToCharge = total;

    pay({
      variables: {
        input: {
          products: items?.map((product) => {
            return {
              id: product.id,
              title: product.title ?? product.label,
              qty: product.qty,
              type: product.__typename,
              services: product?.selectedOptions,
            };
          }),
          coupon: discount?.id,
          amount: amountToCharge,
          paymentmethod: "Zarinpal",
          host,
          type,
          // @ts-ignore
          site: parseInt(process.env.NEXT_PUBLIC_SITE),
        },
      },
    });
  };

  return {
    handleSubmit,
  };
}

export default usePayment;

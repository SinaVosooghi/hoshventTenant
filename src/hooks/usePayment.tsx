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
    onCompleted: ({ createPayment }) => {
      setLoading(false);
      if (createPayment) {
        notification.success({ message: "پرداخت با موفقیت انجام شد" });
        dispatch.cart.emptyCart();
        dispatch.cart.removeDiscount();
        router.push(`/panel/`);
      } else {
        notification.error({ message: "خطا هنگام خرید رویداد" });
      }
    },
    onError: (error) => {
      setLoading(false);
      notification.error({ message: "Error", description: error.message });
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const amountToCharge = total;

    pay({
      variables: {
        input: {
          products: items?.map((product) => {
            return {
              id: product.id,
              title: product.title,
              qty: product.qty,
            };
          }),
          coupon: discount?.id,
          amount: amountToCharge,
          paymentmethod: "Zarinpal",
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

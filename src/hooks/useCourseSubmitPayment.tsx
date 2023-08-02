import { useMutation } from "@apollo/client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FormEvent } from "react";
import { siteCreatePayment } from "../shared/apollo/graphql/mutations/payment/create";
import { notification } from "antd";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../shared/store";

function useCoursePaymentForm({
  courseId,
  total,
  setLoading,
  items,
  type,
}: {
  courseId?: number;
  total: number;
  setLoading: any;
  items?: any[];
  type: "course" | "shop";
}) {
  const stripe = useStripe();
  const router = useRouter();
  const dispatch = useDispatch<Dispatch>();
  const { discount } = useSelector((state: RootState) => state.cart);

  const elements = useElements();
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
        notification.error({ message: "خطا هنگام خرید دوره" });
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

    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !elements || !cardElement) {
      return;
    }

    const stripeResponse = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    const { error, paymentMethod } = stripeResponse;

    if (error || !paymentMethod) {
      return;
    }

    const paymentMethodId = paymentMethod.id;
    if (type === "course") {
      pay({
        variables: {
          input: {
            paymentMethodId,
            course: courseId,
            amount: amountToCharge,
            paymentmethod: "Stripe",
            coupon: discount?.id,
            type,
          },
        },
      });
    } else {
      pay({
        variables: {
          input: {
            paymentMethodId,
            products: items?.map((product) => {
              return {
                id: product.id,
                title: product.title,
                qty: product.qty,
              };
            }),
            coupon: discount?.id,
            amount: amountToCharge,
            paymentmethod: "Stripe",
            type,
          },
        },
      });
    }
  };

  return {
    handleSubmit,
  };
}

export default useCoursePaymentForm;

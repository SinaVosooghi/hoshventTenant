import { createModel } from "@rematch/core";
import { RootState } from "..";
import Product from "../../../datamodel/Product";

const DEFAULT_FILTER_STATE = {
  items: [],
  discount: null,
};

type Modify<T, R> = Omit<T, keyof R> & R;

type MyType = Modify<
  typeof DEFAULT_FILTER_STATE,
  {
    items: Product[];
    discount: {
      code: string;
      percent: number;
      id: number;
      title: string;
    } | null;
  }
>;

// @ts-ignore
const defaultStateWithType: MyType = DEFAULT_FILTER_STATE;

const cartModel = createModel<RootState>()({
  effects: {},
  reducers: {
    addItem(state, action) {
      const index = state.items.findIndex(
        (event) => event.id === event.id
      );
      let data = [...state.items];

      if (index >= 0) {
        data[index].qty = 1;
      } else {
        data = [...state.items, { ...action, qty: 1 }];
      }


      return {
        ...state,
        items: data,
      };
    },
    addDiscount(state, discount) {
      return {
        ...state,
        discount,
      };
    },
    removeDiscount(state) {
      return {
        ...state,
        discount: null,
      };
    },
    addQuantity(state, action) {
      const index = state.items.findIndex(
        (product) => product.id === action.id
      );
      let data = [...state.items];
      if (index >= 0) {
        data[index].qty += 1;
      }

      return {
        ...state,
        items: data,
      };
    },
    subQuantity(state, action) {
      const index = state.items.findIndex(
        (product) => product.id === action.id
      );
      let data = [...state.items];
      if (index >= 0) {
        if (data[index].qty === 1) {
          data.splice(index, 1);
        } else {
          data[index].qty -= 1;
        }
      }

      return {
        ...state,
        items: data,
      };
    },
    removeCart(state, action) {
      let data = [...state.items];

      const itemIndex = data.findIndex((product) => product.id === action.id);
      if (itemIndex > -1) {
        data.splice(itemIndex, 1);
      }

      return {
        ...state,
        items: data,
      };
    },
    emptyCart(state) {
      return {
        ...state,
        items: [],
      };
    },
  },
  state: defaultStateWithType,
});

export default cartModel;

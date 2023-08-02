import { Models } from "@rematch/core";
import courseCheckoutModel from "./coursecheckout";
import users from "./users";
import cart from "./cart";

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  courseCheckoutModel: typeof courseCheckoutModel;
  cart: typeof cart;
}

export const models: RootModel = {
  users,
  courseCheckoutModel,
  cart,
};

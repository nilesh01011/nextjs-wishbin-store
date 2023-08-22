import bannerImage from "./bannerImage";
import category from "./category";
import contact from "./contact";
import order from "./order";
import orderCancel from "./orderCancel";
import product from "./product";
import user from "./user";
import wishlist from "./wishlist";

export const schema = {
  types: [product, category, bannerImage, user, order, wishlist, orderCancel,contact],
}

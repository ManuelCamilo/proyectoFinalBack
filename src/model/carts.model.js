import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

cartSchema.pre('findById', function () {
  this.populate('products.product')
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  deliveryTime: number; // in minutes
  costForTwo: number;
  discountText?: string;
  menuItems: mongoose.Types.ObjectId[];
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  cuisines: [{ type: String }],
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number, required: true },
  costForTwo: { type: Number, required: true },
  discountText: { type: String },
  menuItems: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
}, { timestamps: true });

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
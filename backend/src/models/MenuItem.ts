import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  veg: boolean;
  description: string;
  image?: string;
}

const MenuItemSchema = new Schema<IMenuItem>({
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  veg: { type: Boolean, required: true },
  description: { type: String },
  image: { type: String }
});

export default mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
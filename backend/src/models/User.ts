import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  favorites: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }]
});

export default mongoose.model<IUser>("User", UserSchema);
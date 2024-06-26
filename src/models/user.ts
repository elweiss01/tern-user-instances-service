import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser {
  email: String;
  role: String[];
}

type UserModel = Model<IUser, {}>;

export const userSchema = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser, UserModel>("User", userSchema);

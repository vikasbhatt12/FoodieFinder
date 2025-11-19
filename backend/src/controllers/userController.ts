import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Signup
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" });

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle Favorite
export const toggleFavorite = async (req: any, res: Response) => {
  const { restaurantId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(restaurantId);
    if (index === -1) {
      user.favorites.push(restaurantId); // Add
    } else {
      user.favorites.splice(index, 1); // Remove
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error updating favorites" });
  }
};
import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import MenuItem from "../models/MenuItem"; // <--- IMPORT THIS to ensure model is registered

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      cuisine, 
      rating, 
      minPrice, 
      maxPrice, 
      sort, 
      page = 1, 
      limit = 9 
    } = req.query;

    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { cuisines: { $regex: search, $options: "i" } },
      ];
    }

    if (cuisine) {
      const cuisinesArray = (cuisine as string).split(",");
      query.cuisines = { $in: cuisinesArray };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (minPrice || maxPrice) {
      query.costForTwo = {};
      if (minPrice) query.costForTwo.$gte = Number(minPrice);
      if (maxPrice) query.costForTwo.$lte = Number(maxPrice);
    }

    let sortOption: any = {};
    switch (sort) {
      case "deliveryTime": sortOption = { deliveryTime: 1 }; break;
      case "rating": sortOption = { rating: -1 }; break;
      case "costLowToHigh": sortOption = { costForTwo: 1 }; break;
      case "costHighToLow": sortOption = { costForTwo: -1 }; break;
      default: sortOption = { _id: 1 }; 
    }

    const restaurants = await Restaurant.find(query)
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const count = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    // Ensure MenuItem is loaded before populating
    // @ts-ignore - forcing the load just in case
    const _ = MenuItem; 

    const restaurant = await Restaurant.findById(req.params.id).populate("menuItems");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    console.error(error); // Log the error to terminal for debugging
    res.status(500).json({ message: "Error fetching restaurant details" });
  }
};
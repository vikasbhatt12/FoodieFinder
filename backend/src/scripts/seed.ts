import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "../models/Restaurant";
import MenuItem from "../models/MenuItem";

dotenv.config();

const NAMES = ["Spice Symphony", "Burger Manor", "Pizza Heaven", "Sushi World", "Taco Fiesta", "Curry House", "Pasta Point", "Wok & Roll", "Grill Master", "Vegan Vibes", "Dessert Den", "Cafe Mocha", "Bistro 55", "Ocean Catch", "Steak House", "Dim Sum Daily", "Kebab Kingdom", "Noodle Bar", "Salad Central", "Donut Dream"];
const CUISINES = [["Indian", "Curry"], ["American", "Burgers"], ["Italian", "Pizza"], ["Japanese", "Sushi"], ["Mexican", "Tacos"], ["Chinese", "Asian"], ["Italian", "Pasta"], ["Chinese", "Noodles"], ["American", "Grill"], ["Healthy", "Vegan"]];
const IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/foodiefinder");
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    const restaurants = [];

    for (let i = 0; i < 20; i++) {
      const cuisineGroup = CUISINES[i % CUISINES.length];
      const image = IMAGES[i % IMAGES.length];
      
      // 1. Create Restaurant
      const newRest = await Restaurant.create({
        name: NAMES[i],
        image: image,
        cuisines: cuisineGroup,
        rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // Random rating 3.5 - 5.0
        deliveryTime: Math.floor(Math.random() * (60 - 20) + 20), // Random time 20-60 mins
        costForTwo: Math.floor(Math.random() * (100 - 20) + 20),
        discountText: i % 3 === 0 ? "50% OFF up to $10" : i % 2 === 0 ? "Free Delivery" : "",
      });

      // 2. Create Menu Items
      const menuItems = [
        { 
          restaurantId: newRest._id, 
          name: `Signature ${cuisineGroup[0]} Dish`, 
          price: Math.floor(Math.random() * 20) + 10, 
          veg: i % 2 === 0, 
          description: "A chef special delight made with fresh ingredients.",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        },
        { 
          restaurantId: newRest._id, 
          name: `Classic ${cuisineGroup[1]} Combo`, 
          price: Math.floor(Math.random() * 15) + 8, 
          veg: true, 
          description: "Best seller combo with sides.",
          image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" 
        },
        { 
            restaurantId: newRest._id, 
            name: "Spicy Special", 
            price: 18, 
            veg: false, 
            description: "Hot and spicy flavors for the brave.",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
        },
      ];

      const createdItems = await MenuItem.insertMany(menuItems);
      
      // 3. Link Items to Restaurant
      newRest.menuItems = createdItems.map(item => item._id) as any;
      await newRest.save();
      
      console.log(`Created: ${NAMES[i]}`);
    }

    console.log("✅ 20 Restaurants Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
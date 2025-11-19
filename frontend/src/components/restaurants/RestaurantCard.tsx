import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  deliveryTime: number;
  costForTwo: number;
  discountText?: string;
}

const RestaurantCard: React.FC<Props> = ({ id, name, image, cuisines, rating, deliveryTime, costForTwo, discountText }) => {
  return (
    <Link to={`/restaurant/${id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {discountText && (
          <div className="absolute bottom-2 left-0 bg-blue-600 text-white px-2 py-1 text-xs font-bold uppercase rounded-r-lg">
            {discountText}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 truncate w-2/3">{name}</h3>
          <div className="flex items-center bg-green-700 text-white px-1.5 py-0.5 rounded text-sm font-semibold">
            <span className="mr-1">{rating}</span>
            <Star size={12} fill="white" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <p className="truncate w-1/2">{cuisines.join(', ')}</p>
          <p>${costForTwo} for two</p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
            <span className="text-xs font-medium text-gray-500">{deliveryTime} min delivery</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
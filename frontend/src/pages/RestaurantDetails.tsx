// Keep imports same as before
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import Navbar from '../components/common/Navbar';
import { Star, Clock, Wallet, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, items } = useCart();

  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const { data } = await client.get(`/restaurants/${id}`);
      return data;
    }
  });

  const getQuantity = (itemId: string) => {
     return items.find(i => i._id === itemId)?.quantity || 0;
  };

  if (isLoading) return <div className="text-center mt-20 font-bold text-xl">Loading...</div>;
  if (isError || !restaurant) return <div className="text-center mt-20">Error loading restaurant</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-red-500 mb-4">
            <ArrowLeft size={20} /> Back to Restaurants
        </Link>

        {/* Header Banner */}
        <div className="bg-gray-900 text-white rounded-xl p-8 flex flex-col md:flex-row justify-between relative overflow-hidden mb-8">
            <div className="absolute inset-0 opacity-30">
                <img src={restaurant.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-gray-300">{restaurant.cuisines.join(', ')}</p>
                <div className="flex gap-4 mt-4">
                    <span className="bg-green-600 px-2 py-1 rounded text-sm font-bold flex items-center gap-1"><Star size={14} fill="white"/> {restaurant.rating}</span>
                    <span className="flex items-center gap-1"><Clock size={16}/> {restaurant.deliveryTime} min</span>
                    <span className="flex items-center gap-1"><Wallet size={16}/> ${restaurant.costForTwo} for two</span>
                </div>
            </div>
        </div>

        {/* Menu Items */}
        <h2 className="text-2xl font-bold mb-6">Recommended Menu</h2>
        <div className="grid gap-6">
            {restaurant.menuItems.map((item: any) => {
              const qty = getQuantity(item._id);
              return (
                <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
                  <div className="flex-1 pr-4">
                    <div className={`w-4 h-4 border ${item.veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center mb-2`}>
                        <div className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="font-semibold">${item.price}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  {/* IMAGE AND BUTTON */}
                  <div className="relative w-36 h-32 shrink-0">
                     <img src={item.image || "https://via.placeholder.com/150"} className="w-full h-28 object-cover rounded-lg" alt={item.name} />
                     
                     {/* GREEN BUTTON */}
                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 shadow-xl">
                        {qty === 0 ? (
                           <button 
                             onClick={() => addToCart(item, restaurant._id, restaurant.name, restaurant.image)}
                             className="w-full bg-green-600 text-white font-bold py-2 rounded-lg shadow hover:bg-green-700 uppercase text-sm"
                           >
                             ADD +
                           </button>
                        ) : (
                           <div className="flex items-center justify-between w-full bg-white border border-green-600 rounded-lg shadow overflow-hidden">
                              <button onClick={() => removeFromCart(item._id)} className="px-3 py-2 text-green-700 font-bold hover:bg-gray-100">-</button>
                              <span className="text-green-700 font-bold text-sm">{qty}</span>
                              <button onClick={() => addToCart(item, restaurant._id, restaurant.name, restaurant.image)} className="px-3 py-2 text-green-700 font-bold hover:bg-gray-100">+</button>
                           </div>
                        )}
                     </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
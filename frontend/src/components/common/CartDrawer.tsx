import React from 'react';
import { X, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const CartDrawer = () => {
  const { items, isCartOpen, toggleCart, removeFromCart, addToCart, cartTotal, restaurantName, restaurantImage, restaurantId, clearCart } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Order Placed Successfully!");
    clearCart();
    toggleCart();
  };

  // Prevent crash if restaurant info is missing
  const safeRestName = restaurantName || "Restaurant";
  const safeRestImage = restaurantImage || "";
  const safeRestId = restaurantId || "";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* FIX: Transparent Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <ShoppingBag size={24} /> Your Cart
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={64} />
              <p className="text-lg font-medium">Cart is empty</p>
              <button onClick={toggleCart} className="text-red-500 font-bold border border-red-500 px-6 py-2 rounded-full hover:bg-red-50">
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Restaurant Header in Cart */}
              <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
                {safeRestImage && <img src={safeRestImage} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                <div>
                  <p className="font-bold text-gray-800">{safeRestName}</p>
                  <button onClick={clearCart} className="text-xs text-red-500 font-bold uppercase">Clear Cart</button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                         <p className="font-semibold text-gray-800">{item.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 ml-5">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center bg-gray-50 border rounded-lg">
                      <button onClick={() => removeFromCart(item._id)} className="px-3 py-1 text-green-600 font-bold hover:bg-gray-200">-</button>
                      <span className="px-2 text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => addToCart(item, safeRestId, safeRestName, safeRestImage)} className="px-3 py-1 text-green-600 font-bold hover:bg-gray-200">+</button>
                    </div>
                    <p className="w-16 text-right font-bold text-gray-700">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Bill */}
              <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between py-2 text-gray-600"><span>Item Total</span><span>${cartTotal}</span></div>
                <div className="flex justify-between py-2 text-gray-600"><span>Delivery</span><span>$2.00</span></div>
                <div className="flex justify-between py-2 text-xl font-bold text-gray-800 border-t mt-2"><span>To Pay</span><span>${cartTotal + 2}</span></div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t">
            <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700">
              Proceed to Pay ${cartTotal + 2}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
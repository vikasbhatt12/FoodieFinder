import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag } from "lucide-react"; // Import Icon
import { useCart } from "../../context/CartContext"; // Import Hook

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleCart, cartCount } = useCart(); // Use Hook
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-black italic text-black tracking-tighter"
        >
          Foodie<span className="text-red-500">Finder</span>
        </Link>

        {/* Location (Visual only) */}
        <div className="hidden md:flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
          <MapPin size={18} className="text-red-500" />
          <span className="text-gray-600 text-sm font-medium">
            New Delhi, India
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* CART BUTTON */}
          <button
            onClick={toggleCart}
            className="relative text-gray-700 hover:text-red-500 transition-colors"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-800 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-500 hover:text-gray-800 font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

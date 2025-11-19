import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Import this
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantDetails from './pages/RestaurantDetails';
import CartDrawer from './components/common/CartDrawer'; // Import this

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* CartProvider MUST be here for the Add buttons to work */}
        <CartProvider> 
          <Router>
            <div className="relative z-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              </Routes>
            </div>
            
            {/* Cart Drawer sits outside Routes to float above everything */}
            <CartDrawer />
            
            <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
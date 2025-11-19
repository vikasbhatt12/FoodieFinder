import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import Navbar from '../components/common/Navbar';
import Shimmer from '../components/restaurants/Shimmer';
import { Search } from 'lucide-react';

const Home = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    cuisine: [] as string[],
    sort: 'relevance',
    minPrice: 0,
    maxPrice: 2000
  });

  const fetchRestaurants = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '9',
      search: filters.search,
      cuisine: filters.cuisine.join(','),
      sort: filters.sort,
      minPrice: filters.minPrice.toString(),
      maxPrice: filters.maxPrice.toString()
    });
    const { data } = await client.get(`/restaurants?${params}`);
    return data;
  };

  const { data, isLoading, isError } = useQuery({
  queryKey: ['restaurants', page, filters],
  queryFn: fetchRestaurants,
  // Optional: Keep previous data while fetching new page to avoid flickering
  placeholderData: (previousData) => previousData 
});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisine or a dish" 
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 shadow-sm"
            onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Left Side */}
          <aside className="w-full lg:w-1/4">
             <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Grid - Right Side */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Shimmer key={i} />)}
              </div>
            ) : isError ? (
              <div className="text-center py-10 text-red-500">Something went wrong.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.restaurants.map((rest: any) => (
                    <RestaurantCard 
                      key={rest._id}
                      id={rest._id}
                      name={rest.name}
                      image={rest.image}
                      cuisines={rest.cuisines}
                      rating={rest.rating}
                      deliveryTime={rest.deliveryTime}
                      costForTwo={rest.costForTwo}
                      discountText={rest.discountText}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-8 gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border rounded bg-white disabled:opacity-50"
                  >Prev</button>
                  <span className="px-4 py-2 bg-red-500 text-white rounded">Page {page}</span>
                  <button 
                    disabled={page === data.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded bg-white disabled:opacity-50"
                  >Next</button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React from 'react';

interface FilterProps {
  filters: {
    search: string;
    cuisine: string[];
    sort: string;
    minPrice: number;
    maxPrice: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const CUISINES = ['Italian', 'American', 'Indian', 'Chinese', 'Mexican', 'Pizza', 'Burgers'];

const FilterSidebar: React.FC<FilterProps> = ({ filters, setFilters }) => {
  
  const handleCuisineChange = (c: string) => {
    const current = filters.cuisine;
    if (current.includes(c)) {
      setFilters((prev: any) => ({ ...prev, cuisine: current.filter(item => item !== c) }));
    } else {
      setFilters((prev: any) => ({ ...prev, cuisine: [...current, c] }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Sort By</h3>
        <div className="space-y-2">
          {[
            { label: 'Relevance', value: 'relevance' },
            { label: 'Rating: High to Low', value: 'rating' },
            { label: 'Cost: Low to High', value: 'costLowToHigh' },
            { label: 'Cost: High to Low', value: 'costHighToLow' },
            { label: 'Delivery Time', value: 'deliveryTime' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
              <input 
                type="radio" 
                name="sort" 
                checked={filters.sort === opt.value}
                onChange={() => setFilters((prev: any) => ({ ...prev, sort: opt.value }))}
                className="accent-red-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Cuisines</h3>
        <div className="space-y-2">
          {CUISINES.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
              <input 
                type="checkbox" 
                checked={filters.cuisine.includes(c)}
                onChange={() => handleCuisineChange(c)}
                className="rounded text-red-500 focus:ring-red-500 accent-red-500"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-3">Cost for Two</h3>
        <div className="px-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={filters.maxPrice} 
            onChange={(e) => setFilters((prev: any) => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-red-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$0</span>
            <span>${filters.maxPrice}+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
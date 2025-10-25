import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, zonas = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, selectedZona);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedZona, onSearch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Campo de búsqueda principal */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filtro por zona */}
        <div className="relative md:w-64">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedZona}
            onChange={(e) => setSelectedZona(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
          >
            <option value="">Todas las zonas</option>
            {zonas.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

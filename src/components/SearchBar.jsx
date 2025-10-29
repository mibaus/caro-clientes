import { useState, useEffect, memo } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';

const SearchBar = memo(({ onSearch, zonas = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('');
  const [selectedUltimaCompra, setSelectedUltimaCompra] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, selectedZona, selectedUltimaCompra);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedZona, selectedUltimaCompra, onSearch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-200/60">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Campo de búsqueda principal */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all duration-200 bg-white text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Filtro por zona */}
        <div className="relative md:w-64">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedZona}
            onChange={(e) => setSelectedZona(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-stone-900"
          >
            <option value="">Todas las zonas</option>
            {zonas.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por última compra */}
        <div className="relative md:w-64">
          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedUltimaCompra}
            onChange={(e) => setSelectedUltimaCompra(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-stone-900"
          >
            <option value="">Todas</option>
            <option value="30">+30 días</option>
            <option value="60">+60 días</option>
            <option value="90">+90 días</option>
          </select>
        </div>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

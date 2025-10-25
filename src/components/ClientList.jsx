import React from 'react';
import { User, MapPin, Loader2 } from 'lucide-react';

const ClientList = ({ clientes, loading, onSelectCliente }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-lavender-500 animate-spin" />
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          onClick={() => onSelectCliente(cliente)}
          className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-lavender-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center flex-shrink-0 group-hover:bg-lavender-200 transition-colors duration-200">
              <User className="w-6 h-6 text-lavender-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{cliente.zona || 'Sin zona'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;

import { memo } from 'react';
import { User, MapPin, Loader2, Clock } from 'lucide-react';

// Función para calcular días desde la última compra
const calcularDiasDesdeCompra = (fechaCompra) => {
  if (!fechaCompra) return null;
  
  const fecha = new Date(fechaCompra);
  
  // Validar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    console.warn('Fecha inválida:', fechaCompra);
    return null;
  }
  
  const hoy = new Date();
  const diferencia = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
  return diferencia;
};

// Función para formatear el texto de días
const formatearDiasCompra = (dias) => {
  if (dias === null) return 'Sin registro';
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 30) return `Hace ${dias} días`;
  if (dias < 60) return `Hace +30 días`;
  if (dias < 90) return `Hace +60 días`;
  return `Hace +90 días`;
};

// Función para obtener el color según los días
const obtenerColorDias = (dias) => {
  if (dias === null) return 'text-stone-400';
  if (dias < 30) return 'text-green-600';
  if (dias < 60) return 'text-yellow-600';
  if (dias < 90) return 'text-orange-600';
  return 'text-red-600';
};

const ClientList = memo(({ clientes, loading, onSelectCliente }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 text-terracotta-600 animate-spin" />
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-16">
        <User className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500 font-medium">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          onClick={() => onSelectCliente(cliente)}
          className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-6 border border-stone-200/60 hover:border-terracotta-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-terracotta-100/80 flex items-center justify-center flex-shrink-0 group-hover:bg-terracotta-200/80 transition-colors duration-300">
              <User className="w-5 h-5 text-terracotta-700/70" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-stone-900 truncate leading-tight mb-1.5">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-stone-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{cliente.zona || 'Sin zona'}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${obtenerColorDias(calcularDiasDesdeCompra(cliente.ultimaCompra))}`}>
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{formatearDiasCompra(calcularDiasDesdeCompra(cliente.ultimaCompra))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ClientList.displayName = 'ClientList';

export default ClientList;

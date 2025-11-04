import { memo } from 'react';
import { User, MapPin, Loader2, Clock, MessageCircle } from 'lucide-react';

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

// Función para enviar mensaje de WhatsApp
const enviarMensajeRecupero = (cliente, e) => {
  e.stopPropagation(); // Evitar que se abra el modal del cliente
  
  const nombre = cliente.nombre || 'cliente';
  const mensaje = `Hola ${nombre} 😊

Te esperamos en Caro Righetti Cocina de Autor para disfrutar de una experiencia distinta.

Con tu reserva, te recibimos con una copa de cortesía y un amuse-bouche o mini tabla de quesos 🍷🧀

¡Te esperamos pronto!`;
  
  // Limpiar el número de teléfono (solo dígitos)
  const telefonoLimpio = String(cliente.telefono || '').replace(/\D/g, '');
  
  if (!telefonoLimpio) {
    alert('Este cliente no tiene número de teléfono registrado');
    return;
  }
  
  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Abrir WhatsApp
  const url = `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`;
  window.open(url, '_blank');
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
      {clientes.map((cliente) => {
        // Calcular una sola vez por cliente
        const diasDesdeCompra = calcularDiasDesdeCompra(cliente.ultimaCompra);
        const textoCompra = formatearDiasCompra(diasDesdeCompra);
        const colorDias = obtenerColorDias(diasDesdeCompra);
        
        return (
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
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${colorDias}`}>
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{textoCompra}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botón de WhatsApp para clientes con más de 60 días sin comprar */}
            {diasDesdeCompra !== null && diasDesdeCompra >= 60 && (
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <button
                  onClick={(e) => enviarMensajeRecupero(cliente, e)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar mensaje de recupero</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

ClientList.displayName = 'ClientList';

export default ClientList;

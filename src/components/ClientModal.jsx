import { useState, memo } from 'react';
import { X, ShoppingCart, Eye, User, MapPin, Phone, Calendar, MessageCircle } from 'lucide-react';

const ClientModal = memo(({ cliente, onClose, onVentaRegistrada }) => {
  const [view, setView] = useState('options'); // 'options' | 'details'

  if (!cliente) return null;

  const handleRegistrarVenta = () => {
    // Optimistic update: cerrar inmediatamente y actualizar UI
    onVentaRegistrada(cliente.id);
    onClose();
    
    // Llamada al API en background (no esperamos)
    fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clienteID: cliente.id }),
    })
    .then(response => response.json())
    .then(result => {
      if (!result.success && result.error) {
        console.error('Error al registrar venta:', result.error);
        // En caso de error, podrías mostrar una notificación
        // pero el usuario ya continuó con su trabajo
      }
    })
    .catch(error => {
      console.error('Error al registrar venta:', error);
      // El error se registra pero no interrumpe la experiencia del usuario
    });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    
    const date = new Date(fecha);
    
    // Validar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida:', fecha);
      return 'N/A';
    }
    
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const abrirWhatsApp = () => {
    // Convertir a string y eliminar caracteres no numéricos
    let telefono = String(cliente.telefono || '').replace(/\D/g, '');
    
    if (!telefono) {
      alert('Este cliente no tiene un número de teléfono registrado.');
      return;
    }
    
    // Si no tiene código de país, agregar 549 (Argentina con 9 para celulares)
    if (telefono.length === 10 && !telefono.startsWith('549')) {
      telefono = '549' + telefono;
    } else if (telefono.length === 10 && !telefono.startsWith('54')) {
      telefono = '54' + telefono;
    }
    
    window.open(`https://wa.me/${telefono}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 p-7 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {cliente.nombre} {cliente.apellido}
              </h2>
              <p className="text-terracotta-100 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-4 h-4" />
                {cliente.zona || 'Sin zona'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-7">
          {view === 'options' && (
            <div className="space-y-3.5">
              <button
                onClick={handleRegistrarVenta}
                className="w-full flex items-center justify-center gap-3 bg-terracotta-600 hover:bg-terracotta-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Registrar Venta
              </button>
              <button
                onClick={() => setView('details')}
                className="w-full flex items-center justify-center gap-3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                Ver Información Completa
              </button>
            </div>
          )}

          {view === 'details' && (
            <div className="space-y-4">
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-4 border border-stone-200/60">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-stone-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500 font-medium">Nombre completo</p>
                    <p className="font-bold text-stone-900 mt-0.5">
                      {cliente.nombre} {cliente.apellido}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-stone-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500 font-medium">Zona</p>
                    <p className="font-bold text-stone-900 mt-0.5">{cliente.zona || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-stone-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-stone-500 font-medium">Teléfono</p>
                    <p className="font-bold text-stone-900 mt-0.5">{cliente.telefono || 'N/A'}</p>
                  </div>
                  {cliente.telefono && (
                    <button
                      onClick={abrirWhatsApp}
                      className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all duration-200"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-stone-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500 font-medium">Última compra</p>
                    <p className="font-bold text-stone-900 mt-0.5">
                      {formatFecha(cliente.ultimaCompra)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView('options')}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3.5 rounded-xl font-semibold transition-all duration-200"
              >
                Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ClientModal.displayName = 'ClientModal';

export default ClientModal;

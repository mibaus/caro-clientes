import React, { useState } from 'react';
import { X, ShoppingCart, Eye, User, MapPin, Phone, Calendar, Loader2 } from 'lucide-react';

const ClientModal = ({ cliente, onClose, onVentaRegistrada }) => {
  const [view, setView] = useState('options'); // 'options' | 'details'
  const [loading, setLoading] = useState(false);

  if (!cliente) return null;

  const handleRegistrarVenta = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteID: cliente.id }),
      });

      const result = await response.json();

      if (response.ok) {
        onVentaRegistrada();
        onClose();
      } else {
        throw new Error(result.error || 'Error al registrar la venta');
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
      alert('Hubo un error al registrar la venta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in">
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
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-terracotta-600 hover:bg-terracotta-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Registrar Venta
                  </>
                )}
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
                  <div>
                    <p className="text-sm text-stone-500 font-medium">Teléfono</p>
                    <p className="font-bold text-stone-900 mt-0.5">{cliente.telefono || 'N/A'}</p>
                  </div>
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
};

export default ClientModal;

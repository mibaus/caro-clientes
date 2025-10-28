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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-lavender-500 to-lavender-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {cliente.nombre} {cliente.apellido}
              </h2>
              <p className="text-lavender-100 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {cliente.zona || 'Sin zona'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'options' && (
            <div className="space-y-3">
              <button
                onClick={handleRegistrarVenta}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-lavender-500 hover:bg-lavender-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                Ver Información Completa
              </button>
            </div>
          )}

          {view === 'details' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-semibold text-gray-900">
                      {cliente.nombre} {cliente.apellido}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Zona</p>
                    <p className="font-semibold text-gray-900">{cliente.zona || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold text-gray-900">{cliente.telefono || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Última compra</p>
                    <p className="font-semibold text-gray-900">
                      {formatFecha(cliente.ultimaCompra)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView('options')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200"
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

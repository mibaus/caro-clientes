import React from 'react';
import { Cake, MapPin, MessageCircle, PartyPopper, Loader2 } from 'lucide-react';

const BirthdayView = ({ clientes, loading }) => {
  const enviarMensajeWhatsApp = (cliente) => {
    const mensaje = `¡Feliz cumpleaños ${cliente.nombre}! Queremos darte un regalo especial. Pasá hoy por la tienda y aprovechá tu descuento.`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    
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
    
    console.log('Abriendo WhatsApp para:', telefono);
    window.open(`https://wa.me/${telefono}?text=${mensajeCodificado}`, '_blank');
  };

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
        <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay cumpleaños hoy</p>
        <p className="text-gray-400 text-sm mt-2">Vuelve mañana para ver si alguien cumple años</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <PartyPopper className="w-8 h-8 text-lavender-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          {clientes.length === 1 ? '1 cumpleaños hoy' : `${clientes.length} cumpleaños hoy`}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl p-5 border border-lavender-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Cake className="w-6 h-6 text-lavender-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {cliente.nombre} {cliente.apellido}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{cliente.zona || 'Sin zona'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => enviarMensajeWhatsApp(cliente)}
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200"
                title="Enviar mensaje de WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayView;

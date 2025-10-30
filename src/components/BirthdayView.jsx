import { memo } from 'react';
import { Cake, MapPin, MessageCircle, PartyPopper, Loader2 } from 'lucide-react';

const BirthdayView = memo(({ clientes, loading }) => {
  const enviarMensajeWhatsApp = (cliente) => {
    // Emojis usando códigos Unicode escapados
    const sparkles = String.fromCodePoint(0x2728); // ✨
    const wine = String.fromCodePoint(0x1F377); // 🍷
    const sushi = String.fromCodePoint(0x1F363); // 🍣
    
    // Construir mensaje con emojis correctos
    const mensaje = `${sparkles} ¡Feliz cumpleaños, ${cliente.nombre}!

El equipo de Caro Righetti Cocina de Autor te desea un nuevo año lleno de sabores, emociones y momentos únicos.

Esta semana queremos agasajarte con una copa de bienvenida sin cargo y un beneficio especial para que disfrutes de una cena inolvidable.

¡Te esperamos para celebrar juntos! ${wine}${sushi}`;
    
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
    
    // Usar encodeURIComponent para codificar correctamente los emojis en UTF-8
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

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
        <Cake className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-600 text-lg font-medium">No hay cumpleaños hoy</p>
        <p className="text-stone-400 text-sm mt-2">Vuelve mañana para ver si alguien cumple años</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <PartyPopper className="w-8 h-8 text-terracotta-600" />
        <h2 className="text-2xl font-bold text-stone-900">
          {clientes.length === 1 ? '1 cumpleaños hoy' : `${clientes.length} cumpleaños hoy`}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl p-6 border border-terracotta-200/70 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Cake className="w-5 h-5 text-terracotta-700/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-lg leading-tight mb-1.5">
                    {cliente.nombre} {cliente.apellido}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-stone-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{cliente.zona || 'Sin zona'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => enviarMensajeWhatsApp(cliente)}
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300"
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
});

BirthdayView.displayName = 'BirthdayView';

export default BirthdayView;

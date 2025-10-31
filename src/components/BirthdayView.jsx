import { memo } from 'react';
import { Cake, MapPin, MessageCircle, PartyPopper, Loader2, Sparkles } from 'lucide-react';

const BirthdayView = memo(({ clientes, loading }) => {
  const enviarMensajeWhatsApp = (cliente) => {
    // Emojis usando códigos Unicode
    const sparkles = String.fromCodePoint(0x2728); // ✨
    const wine = String.fromCodePoint(0x1F377); // 🍷
    const sushi = String.fromCodePoint(0x1F363); // 🍣
    
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
    
    if (telefono.length === 10 && !telefono.startsWith('549')) {
      telefono = '549' + telefono;
    } else if (telefono.length === 10 && !telefono.startsWith('54')) {
      telefono = '54' + telefono;
    }
    
    // Codificar mensaje para URL
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-terracotta-600 animate-spin" />
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center mx-auto mb-6 shadow-luxury">
          <Cake className="w-10 h-10 text-rose-400" />
        </div>
        <h3 className="text-stone-700 text-xl font-semibold mb-2">No hay cumpleaños hoy</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">Vuelve mañana para celebrar con tus clientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-luxury flex items-center justify-center">
          <PartyPopper className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-stone-900 tracking-tight">
            {clientes.length === 1 ? '¡Cumpleaños Hoy!' : `${clientes.length} Cumpleaños Hoy`}
          </h2>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Clientes cumpliendo años • ¡Tiempo de celebrar!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="group relative bg-gradient-to-br from-pink-50/90 via-rose-50/90 to-orange-50/90 rounded-3xl p-6 border-2 border-rose-100 shadow-luxury hover:shadow-luxury-lg transition-all duration-500"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110">
                    <Cake className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse">
                    <Sparkles className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-stone-900 text-xl leading-tight mb-2 group-hover:text-rose-700 transition-colors">
                    {cliente.nombre} {cliente.apellido}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-stone-400" />
                    <span className="font-medium">{cliente.zona || 'Sin zona'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => enviarMensajeWhatsApp(cliente)}
                className="group/btn flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center text-white shadow-luxury hover:shadow-luxury-lg transition-all duration-300 transform hover:scale-110"
                title="Enviar mensaje de cumpleaños"
              >
                <MessageCircle className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
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

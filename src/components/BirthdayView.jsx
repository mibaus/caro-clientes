import { memo } from 'react';
import { Cake, MapPin, MessageCircle, Loader2 } from 'lucide-react';

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
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 text-terracotta-600 animate-spin" />
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-pink-100 mb-5">
          <Cake className="w-8 h-8 text-pink-600" />
        </div>
        <h3 className="text-stone-900 text-lg font-semibold mb-2">Sin cumpleaños hoy</h3>
        <p className="text-stone-500 text-sm">Vuelve mañana para ver quién celebra</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-1 tracking-tight">
          Cumpleaños de Hoy
        </h1>
        <p className="text-stone-600 text-sm">
          {clientes.length} {clientes.length === 1 ? 'cliente cumple años' : 'clientes cumplen años'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="group bg-white/70 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl rounded-2xl p-6 ring-2 ring-pink-400/30 hover:ring-pink-400/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Cake className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2 leading-tight">
                    {cliente.nombre} {cliente.apellido}
                  </h3>
                  {cliente.zona && (
                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{cliente.zona}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => enviarMensajeWhatsApp(cliente)}
                className="flex-shrink-0 w-11 h-11 rounded-xl bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors duration-150"
                title="Enviar felicitación"
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

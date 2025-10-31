import { memo, useState } from 'react';
import { UserPlus, MessageCircle, Clock, MapPin, Loader2, CheckCircle, Sparkles } from 'lucide-react';

// Función para calcular días desde el registro
const calcularDiasDesdeRegistro = (fechaCompra) => {
  if (!fechaCompra) return null;
  const fecha = new Date(fechaCompra);
  const hoy = new Date();
  const diferencia = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
  return diferencia;
};

// Función para formatear el texto de días
const formatearDiasRegistro = (dias) => {
  if (dias === null) return 'Sin registro';
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;
  if (dias < 14) return 'Hace 1 semana';
  if (dias < 30) return `Hace ${Math.floor(dias / 7)} semanas`;
  return `Hace +1 mes`;
};

const NewClientsView = memo(({ clientes, loading, onClienteContactado }) => {
  const [loadingContactados, setLoadingContactados] = useState({});

  // Filtrar solo clientes NO contactados
  const clientesPendientes = clientes.filter(c => {
    const contactado = String(c.contactado || '').toLowerCase().trim();
    // Filtrar si está contactado (cualquier valor que indique "sí")
    return contactado === '' || (contactado !== 'sí' && contactado !== 'si' && contactado !== 'yes' && contactado !== 'true' && contactado !== 's' && contactado !== 'y');
  });

  const marcarComoContactado = async (cliente) => {
    setLoadingContactados(prev => ({ ...prev, [cliente.id]: true }));

    try {
      const response = await fetch('/api/contactados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: cliente.id })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Notificar al componente padre que se marcó el cliente
        if (onClienteContactado) {
          onClienteContactado(cliente.id);
        }
      } else {
        alert(result.error || 'Error al marcar cliente como contactado');
      }
    } catch (error) {
      console.error('Error al marcar contactado:', error);
      alert('Error de conexión al marcar cliente');
    } finally {
      setLoadingContactados(prev => ({ ...prev, [cliente.id]: false }));
    }
  };

  const enviarMensajeWhatsApp = (cliente) => {
    // Emojis usando códigos Unicode
    const sparkles = String.fromCodePoint(0x2728); // ✨
    const heart = String.fromCodePoint(0x1F496); // 💖
    const wine = String.fromCodePoint(0x1F377); // 🍷
    
    const mensaje = `${sparkles} ¡Hola ${cliente.nombre}!

Muchas gracias por registrarte en Caro Righetti Cocina de Autor ${heart}

Estamos muy felices de que formes parte de nuestra comunidad gastronómica. Queremos que tu experiencia sea inolvidable cada vez que nos visites.

Si tenés alguna consulta o querés hacer una reserva, no dudes en escribirnos. ¡Te esperamos pronto para compartir una experiencia única! ${wine}

¡Saludos!
Equipo Caro Righetti`;
    
    // Convertir a string y eliminar caracteres no numéricos
    let telefono = String(cliente.telefono || '').replace(/\D/g, '');
    
    if (!telefono) {
      alert('Este cliente no tiene un número de teléfono registrado.');
      return;
    }
    
    // Normalizar formato argentino
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
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center mx-auto mb-6 shadow-luxury">
          <UserPlus className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="text-stone-700 text-xl font-semibold mb-2">No hay nuevos clientes</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">Los nuevos registros aparecerán aquí automáticamente</p>
      </div>
    );
  }

  if (clientesPendientes.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-luxury">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-stone-700 text-xl font-semibold mb-2">¡Todo al día!</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">Ya contactaste a todos los clientes nuevos</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-luxury flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-stone-900 tracking-tight">
              {clientesPendientes.length} {clientesPendientes.length === 1 ? 'Cliente Nuevo' : 'Clientes Nuevos'}
            </h2>
            <p className="text-sm text-stone-500 mt-1 font-medium">
              Últimos 50 registros • Pendientes de contacto
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clientesPendientes.map((cliente) => {
          const diasRegistro = calcularDiasDesdeRegistro(cliente.ultimaCompra);
          const esReciente = diasRegistro !== null && diasRegistro <= 7;

          return (
            <div
              key={cliente.id}
              className={`group relative rounded-3xl p-6 shadow-luxury hover:shadow-luxury-lg transition-all duration-500 backdrop-blur-sm ${
                esReciente
                  ? 'bg-gradient-to-br from-green-50/90 via-emerald-50/90 to-teal-50/90 border-2 border-green-100'
                  : 'bg-gradient-to-br from-white/90 via-stone-50/90 to-amber-50/90 border-2 border-stone-100'
              }`}
            >
              <div className="space-y-5">
                {/* Header con info del cliente */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 ${
                      esReciente 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-br from-terracotta-500 to-terracotta-600'
                    }`}>
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    {esReciente && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-stone-900 text-xl leading-tight mb-2 group-hover:text-terracotta-700 transition-colors">
                      {cliente.nombre} {cliente.apellido}
                    </h3>
                    <div className="space-y-1.5">
                      {cliente.zona && (
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-stone-400" />
                          <span className="font-medium">{cliente.zona}</span>
                        </div>
                      )}
                      <div className={`flex items-center gap-2 text-sm font-semibold ${
                        esReciente ? 'text-green-700' : 'text-stone-600'
                      }`}>
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Registrado {formatearDiasRegistro(diasRegistro)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge de nuevo */}
                {esReciente && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Nuevo esta semana
                  </div>
                )}

                {/* Botones de acción */}
                <div className="pt-3 space-y-3">
                  <button
                    onClick={() => enviarMensajeWhatsApp(cliente)}
                    className="w-full group/btn flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl shadow-luxury hover:shadow-luxury-lg transition-all duration-300 transform hover:scale-[1.02]"
                    title="Enviar mensaje de bienvenida"
                  >
                    <MessageCircle className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    <span>Enviar WhatsApp</span>
                  </button>

                  <button
                    onClick={() => marcarComoContactado(cliente)}
                    disabled={loadingContactados[cliente.id]}
                    className="w-full group/btn flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-luxury hover:shadow-luxury-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                    title="Marcar como contactado"
                  >
                    {loadingContactados[cliente.id] ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Marcando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        <span>Marcar como Contactado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

NewClientsView.displayName = 'NewClientsView';

export default NewClientsView;

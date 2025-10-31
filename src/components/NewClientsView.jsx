import { memo, useState } from 'react';
import { UserPlus, MessageCircle, Clock, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

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
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 text-terracotta-600 animate-spin" />
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-stone-100 mb-5">
          <UserPlus className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-stone-900 text-lg font-semibold mb-2">Sin clientes nuevos</h3>
        <p className="text-stone-500 text-sm">Los registros aparecerán aquí</p>
      </div>
    );
  }

  if (clientesPendientes.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-green-100 mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-stone-900 text-lg font-semibold mb-2">¡Todo listo!</h3>
        <p className="text-stone-500 text-sm">Todos los clientes fueron contactados</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-1 tracking-tight">
          Nuevos Clientes
        </h1>
        <p className="text-stone-600 text-sm">
          {clientesPendientes.length} {clientesPendientes.length === 1 ? 'cliente pendiente' : 'clientes pendientes'} de contactar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clientesPendientes.map((cliente) => {
          const diasRegistro = calcularDiasDesdeRegistro(cliente.ultimaCompra);
          const esReciente = diasRegistro !== null && diasRegistro <= 7;

          return (
            <div
              key={cliente.id}
              className={`group relative glass shadow-glass hover:shadow-glass-lg rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                esReciente
                  ? 'ring-2 ring-green-400/30 hover:ring-green-400/50'
                  : ''
              }`}
            >
              <div className="space-y-5">
                {/* Header con info del cliente */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      esReciente ? 'bg-green-100' : 'bg-stone-100'
                    }`}>
                      <UserPlus className={`w-5 h-5 ${
                        esReciente ? 'text-green-600' : 'text-stone-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-stone-900 mb-2 leading-tight">
                        {cliente.nombre} {cliente.apellido}
                      </h3>
                      <div className="space-y-1">
                        {cliente.zona && (
                          <div className="flex items-center gap-1.5 text-sm text-stone-600">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{cliente.zona}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-stone-500">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formatearDiasRegistro(diasRegistro)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {esReciente && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                      Nuevo
                    </span>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => enviarMensajeWhatsApp(cliente)}
                    className="flex-1 flex items-center justify-center px-4 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-150"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => marcarComoContactado(cliente)}
                    disabled={loadingContactados[cliente.id]}
                    className="flex-1 flex items-center justify-center px-4 py-4 bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-150"
                    title="Marcar como contactado"
                  >
                    {loadingContactados[cliente.id] ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
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

import { memo, useState } from 'react';
import { UserPlus, MessageCircle, CheckCircle, Clock, MapPin, Loader2 } from 'lucide-react';

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
  // Estado local para UI optimista (ocultar inmediatamente mientras se guarda)
  const [clientesOcultosLocal, setClientesOcultosLocal] = useState([]);
  const [procesando, setProcesando] = useState([]);

  // Filtrar clientes NO contactados (desde Google Sheets + ocultados localmente)
  const clientesPendientes = clientes.filter(
    cliente => !cliente.contactado && !clientesOcultosLocal.includes(cliente.id)
  );

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

  const marcarComoContactado = async (clienteId) => {
    try {
      // Ocultar inmediatamente (UI optimista)
      setClientesOcultosLocal(prev => [...prev, clienteId]);
      setProcesando(prev => [...prev, clienteId]);

      // Llamar al API para marcar en Google Sheets
      const response = await fetch('/api/marcar-contactado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId })
      });

      if (!response.ok) {
        throw new Error('Error al marcar como contactado');
      }

      // Notificar al componente padre para refrescar datos
      if (onClienteContactado) {
        onClienteContactado(clienteId);
      }

    } catch (error) {
      console.error('Error al marcar contactado:', error);
      alert('No se pudo marcar el cliente como contactado. Intenta nuevamente.');
      // Revertir el cambio optimista
      setClientesOcultosLocal(prev => prev.filter(id => id !== clienteId));
    } finally {
      setProcesando(prev => prev.filter(id => id !== clienteId));
    }
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
        <UserPlus className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-600 text-lg font-medium">No hay nuevos clientes</p>
        <p className="text-stone-400 text-sm mt-2">Los nuevos registros aparecerán aquí</p>
      </div>
    );
  }

  if (clientesPendientes.length === 0) {
    const clientesContactados = clientes.filter(c => c.contactado);
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-stone-600 text-lg font-medium">¡Todos los clientes fueron contactados!</p>
        <p className="text-stone-400 text-sm mt-2">
          {clientesContactados.length} {clientesContactados.length === 1 ? 'cliente contactado' : 'clientes contactados'}
        </p>
      </div>
    );
  }

  const clientesContactados = clientes.filter(c => c.contactado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-terracotta-600" />
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              {clientesPendientes.length} {clientesPendientes.length === 1 ? 'cliente pendiente' : 'clientes pendientes'}
            </h2>
            <p className="text-sm text-stone-500 mt-0.5">
              {clientesContactados.length > 0 && (
                <span>{clientesContactados.length} ya contactados</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clientesPendientes.map((cliente) => {
          const diasRegistro = calcularDiasDesdeRegistro(cliente.ultimaCompra);
          const esReciente = diasRegistro !== null && diasRegistro <= 7;

          return (
            <div
              key={cliente.id}
              className={`bg-gradient-to-br rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 ${
                esReciente
                  ? 'from-green-50/80 to-emerald-50/80 border-green-200/70'
                  : 'from-amber-50/80 to-orange-50/80 border-terracotta-200/70'
              }`}
            >
              <div className="space-y-4">
                {/* Header con info del cliente */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <UserPlus className="w-5 h-5 text-terracotta-700/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 text-lg leading-tight mb-1">
                      {cliente.nombre} {cliente.apellido}
                    </h3>
                    <div className="space-y-1">
                      {cliente.zona && (
                        <div className="flex items-center gap-1.5 text-sm text-stone-500">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{cliente.zona}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Registrado {formatearDiasRegistro(diasRegistro)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge de nuevo */}
                {esReciente && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Nuevo esta semana
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => enviarMensajeWhatsApp(cliente)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    title="Enviar mensaje de bienvenida"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar WhatsApp
                  </button>
                  
                  <button
                    onClick={() => marcarComoContactado(cliente.id)}
                    disabled={procesando.includes(cliente.id)}
                    className={`px-4 py-3 font-medium rounded-xl border-2 transition-all duration-300 ${
                      procesando.includes(cliente.id)
                        ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                    title="Marcar como contactado"
                  >
                    {procesando.includes(cliente.id) ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
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

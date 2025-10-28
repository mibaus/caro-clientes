import React, { useState, useEffect, useCallback } from 'react';
import { Cake, Users } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ClientList from './components/ClientList';
import ClientModal from './components/ClientModal';
import BirthdayView from './components/BirthdayView';
import Toast from './components/Toast';

function App() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clientesCumpleanos, setClientesCumpleanos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [activeView, setActiveView] = useState('clientes'); // 'clientes' | 'cumpleanos'
  const [toast, setToast] = useState(null);

  // Cargar todos los clientes al inicio
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clientes');
      const data = await response.json();
      
      // Debug: verificar respuesta del API
      if (data.error) {
        console.error('Error del API:', data.error, data.debug);
      }
      
      // Manejar diferentes formatos de respuesta
      let clientesData = [];
      if (Array.isArray(data)) {
        clientesData = data;
      } else if (data && data.clientes && Array.isArray(data.clientes)) {
        clientesData = data.clientes;
      } else if (data && data.data && Array.isArray(data.data)) {
        clientesData = data.data;
      }
      
      // Debug simple
      if (clientesData.length > 0) {
        console.log('✅ Clientes recibidos:', clientesData.length);
      }
      
      // Normalizar campos del API (mapear nombres de Google Sheets a nombres esperados)
      clientesData = clientesData.map((cliente, index) => ({
        id: cliente.ID || cliente.id || cliente.ClienteID || cliente.clienteID || cliente['ID Cliente'] || String(index + 1),
        nombre: cliente.nombre || cliente.Nombre || '',
        apellido: cliente.apellido || cliente.Apellido || '',
        zona: cliente.zona || cliente.Zona || '',
        telefono: cliente.telefono || cliente.Celular || cliente['Celular 📱'] || '',
        fechaNacimiento: cliente.fechaNacimiento || cliente['Fecha de cumpleaños 🎂'] || cliente.fechaCumpleanos || '',
        ultimaCompra: cliente.ultimaCompra || cliente['Última compra'] || cliente['Marca temporal'] || ''
      }));
      
      
      if (clientesData.length > 0) {
        setClientes(clientesData);
        setClientesFiltrados(clientesData);
        
        // Extraer zonas únicas
        const zonasUnicas = [...new Set(clientesData.map(c => c.zona).filter(Boolean))];
        setZonas(zonasUnicas);
        
        // Filtrar cumpleaños del día
        const hoy = new Date();
        const cumpleanos = clientesData.filter(cliente => {
          if (!cliente.fechaNacimiento) return false;
          const fechaNac = new Date(cliente.fechaNacimiento);
          return fechaNac.getDate() === hoy.getDate() && 
                 fechaNac.getMonth() === hoy.getMonth();
        });
        setClientesCumpleanos(cumpleanos);
      } else {
        showToast('No se encontraron clientes en la respuesta', 'error');
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showToast('Error al cargar los clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((searchTerm, zona) => {
    let filtered = [...clientes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        cliente => {
          const nombreMatch = cliente.nombre?.toLowerCase().includes(term);
          const apellidoMatch = cliente.apellido?.toLowerCase().includes(term);
          return nombreMatch || apellidoMatch;
        }
      );
    }

    if (zona) {
      filtered = filtered.filter(cliente => cliente.zona === zona);
    }

    setClientesFiltrados(filtered);
  }, [clientes]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleVentaRegistrada = () => {
    showToast('¡Venta registrada correctamente!', 'success');
    console.log('♻️ Recargando clientes después de registrar venta...');
    // Pequeño delay para dar tiempo al Apps Script a actualizar
    setTimeout(() => {
      fetchClientes();
    }, 1000); // 1 segundo de delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 py-4">
            <nav className="flex gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveView('clientes')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  activeView === 'clientes'
                    ? 'bg-white text-terracotta-700 shadow-sm'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Clientes
              </button>
              <button
                onClick={() => setActiveView('cumpleanos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 relative ${
                  activeView === 'cumpleanos'
                    ? 'bg-white text-terracotta-700 shadow-sm'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <Cake className="w-4 h-4" />
                Cumpleaños
                {clientesCumpleanos.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                    {clientesCumpleanos.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeView === 'clientes' && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} zonas={zonas} />
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-stone-200/60">
              <ClientList
                clientes={clientesFiltrados}
                loading={loading}
                onSelectCliente={setSelectedCliente}
              />
            </div>
          </div>
        )}

        {activeView === 'cumpleanos' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-stone-200/60">
            <BirthdayView clientes={clientesCumpleanos} loading={loading} />
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedCliente && (
        <ClientModal
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onVentaRegistrada={handleVentaRegistrada}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;

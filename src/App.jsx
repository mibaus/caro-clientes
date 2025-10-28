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
      
      // Debug: mostrar TODOS los campos del primer cliente
      if (clientesData.length > 0) {
        console.log('🔍 Primer cliente RAW (todos los campos):', clientesData[0]);
        console.log('🔍 Campos disponibles:', Object.keys(clientesData[0]));
        console.log('🔍 ¿Tiene campo "Última compra"?', clientesData[0]['Última compra']);
        console.log('🔍 Marca temporal:', clientesData[0]['Marca temporal']);
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
      
      console.log('✅ Clientes cargados:', clientesData.length);
      console.log('🔍 Primer cliente normalizado:', clientesData[0]);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-500 to-lavender-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Gestión de Clientes</h1>
            </div>

            <nav className="flex gap-2">
              <button
                onClick={() => setActiveView('clientes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeView === 'clientes'
                    ? 'bg-lavender-100 text-lavender-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Clientes
              </button>
              <button
                onClick={() => setActiveView('cumpleanos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                  activeView === 'cumpleanos'
                    ? 'bg-lavender-100 text-lavender-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Cake className="w-4 h-4" />
                Cumpleaños
                {clientesCumpleanos.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {clientesCumpleanos.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'clientes' && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} zonas={zonas} />
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <ClientList
                clientes={clientesFiltrados}
                loading={loading}
                onSelectCliente={setSelectedCliente}
              />
            </div>
          </div>
        )}

        {activeView === 'cumpleanos' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Cake, Users, Loader2, LogOut } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ClientList from './components/ClientList';
import Login from './components/Login';

// Lazy loading para componentes pesados
const ClientModal = lazy(() => import('./components/ClientModal'));
const BirthdayView = lazy(() => import('./components/BirthdayView'));
const Toast = lazy(() => import('./components/Toast'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [activeView, setActiveView] = useState('clientes'); // 'clientes' | 'cumpleanos'
  const [toast, setToast] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const authLocal = localStorage.getItem('isAuthenticated');
    const authSession = sessionStorage.getItem('isAuthenticated');
    if (authLocal === 'true' || authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchClientes = useCallback(async () => {
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
      } else {
        setToast({ message: 'No se encontraron clientes en la respuesta', type: 'error' });
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setToast({ message: 'Error al cargar los clientes', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar todos los clientes al inicio
  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoizar cálculo de cumpleaños del día
  const clientesCumpleanosHoy = useMemo(() => {
    const hoy = new Date();
    return clientes.filter(cliente => {
      if (!cliente.fechaNacimiento) return false;
      const fechaNac = new Date(cliente.fechaNacimiento);
      return fechaNac.getDate() === hoy.getDate() && 
             fechaNac.getMonth() === hoy.getMonth();
    });
  }, [clientes]);

  const handleSearch = useCallback((searchTerm, zona) => {
    if (!searchTerm && !zona) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtered = clientes.filter(cliente => {
      const nombreMatch = !searchTerm || cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const apellidoMatch = !searchTerm || cliente.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
      const zonaMatch = !zona || cliente.zona === zona;
      
      return (nombreMatch || apellidoMatch) && zonaMatch;
    });

    setClientesFiltrados(filtered);
  }, [clientes]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleVentaRegistrada = useCallback((clienteID) => {
    showToast('¡Venta registrada correctamente!', 'success');
    
    // Actualización optimista: actualizar solo el cliente localmente
    const fechaHoy = new Date().toISOString();
    
    setClientes(prevClientes => 
      prevClientes.map(c => 
        c.id === clienteID 
          ? { ...c, ultimaCompra: fechaHoy }
          : c
      )
    );
    
    setClientesFiltrados(prevFiltrados => 
      prevFiltrados.map(c => 
        c.id === clienteID 
          ? { ...c, ultimaCompra: fechaHoy }
          : c
      )
    );
  }, [showToast]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    showToast('Sesión cerrada correctamente', 'success');
  };

  // Mostrar Login si no está autenticado
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-4">
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
                {clientesCumpleanosHoy.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                    {clientesCumpleanosHoy.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-terracotta-600 hover:bg-stone-100 rounded-lg transition-all duration-200 font-medium"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
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
            <Suspense fallback={
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 text-terracotta-600 animate-spin" />
              </div>
            }>
              <BirthdayView clientes={clientesCumpleanosHoy} loading={loading} />
            </Suspense>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedCliente && (
        <Suspense fallback={null}>
          <ClientModal
            cliente={selectedCliente}
            onClose={() => setSelectedCliente(null)}
            onVentaRegistrada={handleVentaRegistrada}
          />
        </Suspense>
      )}

      {/* Toast */}
      {toast && (
        <Suspense fallback={null}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Cake, Users, Loader2, Menu, X, UserPlus } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ClientList from './components/ClientList';
import Login from './components/Login';

// Lazy loading para componentes pesados
const ClientModal = lazy(() => import('./components/ClientModal'));
const BirthdayView = lazy(() => import('./components/BirthdayView'));
const NewClientsView = lazy(() => import('./components/NewClientsView'));
const Toast = lazy(() => import('./components/Toast'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [activeView, setActiveView] = useState('clientes'); // 'clientes' | 'cumpleanos' | 'nuevos'
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      
      // Verificar errores del API
      if (data.error) {
        console.error('Error del API:', data.error);
        setToast({ message: `Error: ${data.error}`, type: 'error' });
        setLoading(false);
        return;
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
      
      // Normalizar campos del API (mapear nombres de Google Sheets a nombres esperados)
      clientesData = clientesData.map((cliente, index) => ({
        id: cliente.ID || cliente.id || cliente.ClienteID || cliente.clienteID || cliente['ID Cliente'] || String(index + 1),
        nombre: cliente.nombre || cliente.Nombre || '',
        apellido: cliente.apellido || cliente.Apellido || '',
        zona: cliente.zona || cliente.Zona || '',
        telefono: cliente.telefono || cliente.Celular || cliente['Celular 📱'] || '',
        fechaNacimiento: cliente.fechaNacimiento || cliente['Fecha de cumpleaños 🎂'] || cliente.fechaCumpleanos || '',
        ultimaCompra: cliente.ultimaCompra || cliente['Última compra'] || cliente['Marca temporal'] || '',
        contactado: cliente.Contactado || cliente.contactado || ''
      }));
      
      
      if (clientesData.length > 0) {
        setClientes(clientesData);
        setClientesFiltrados(clientesData);
        
        // Extraer zonas únicas
        const zonasUnicas = [...new Set(clientesData.map(c => c.zona).filter(Boolean))];
        setZonas(zonasUnicas);
      } else {
        // Sin clientes en la base de datos (puede ser normal si no hay datos)
        setClientes([]);
        setClientesFiltrados([]);
        setZonas([]);
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

  // Memoizar clientes nuevos (últimos 30 días o máximo 50)
  const clientesNuevos = useMemo(() => {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    return [...clientes]
      .filter(c => c.ultimaCompra) // Solo clientes con compras registradas
      .sort((a, b) => {
        const fechaA = new Date(a.ultimaCompra);
        const fechaB = new Date(b.ultimaCompra);
        return fechaB - fechaA; // Más recientes primero
      })
      .slice(0, 50); // Mostrar hasta 50 más recientes
  }, [clientes]);

  // Memoizar cálculo de cumpleaños del día
  const clientesCumpleanosHoy = useMemo(() => {
    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth(); // 0-11
    
    console.log('=== DEBUG CUMPLEAÑOS ===');
    console.log(`📅 Fecha de hoy: ${diaHoy}/${mesHoy + 1}/${hoy.getFullYear()}`);
    console.log(`👥 Total de clientes cargados: ${clientes.length}`);
    
    // Mostrar todas las fechas de nacimiento
    clientes.forEach((cliente, idx) => {
      if (cliente.fechaNacimiento) {
        console.log(`${idx + 1}. ${cliente.nombre} - Fecha: "${cliente.fechaNacimiento}"`);
      }
    });
    
    const cumpleaneros = clientes.filter(cliente => {
      if (!cliente.fechaNacimiento) return false;
      
      let fechaNac;
      const fechaStr = String(cliente.fechaNacimiento).trim();
      
      console.log(`\n🔍 Procesando: ${cliente.nombre} - "${fechaStr}"`);
      
      // Parsear diferentes formatos de fecha
      if (fechaStr.includes('/')) {
        // Formato DD/MM/YYYY o MM/DD/YYYY
        const partes = fechaStr.split('/');
        if (partes.length === 3) {
          // Asumimos DD/MM/YYYY (formato común en Latinoamérica)
          const dia = parseInt(partes[0], 10);
          const mes = parseInt(partes[1], 10) - 1; // Mes 0-11
          const anio = parseInt(partes[2], 10);
          fechaNac = new Date(anio, mes, dia);
          console.log(`   Parseado DD/MM/YYYY → día: ${dia}, mes: ${mes + 1}, año: ${anio}`);
        }
      } else if (fechaStr.includes('-')) {
        // Formato ISO: YYYY-MM-DD
        fechaNac = new Date(fechaStr);
        console.log(`   Parseado ISO → ${fechaNac.getDate()}/${fechaNac.getMonth() + 1}/${fechaNac.getFullYear()}`);
      } else {
        // Intentar parsear como está
        fechaNac = new Date(fechaStr);
        console.log(`   Parseado genérico → ${fechaNac}`);
      }
      
      // Validar que la fecha sea válida
      if (isNaN(fechaNac.getTime())) {
        console.log(`   ❌ FECHA INVÁLIDA`);
        return false;
      }
      
      const diaNac = fechaNac.getDate();
      const mesNac = fechaNac.getMonth();
      
      console.log(`   Comparando: ${diaNac}/${mesNac + 1} vs ${diaHoy}/${mesHoy + 1}`);
      
      const esCumpleanos = diaNac === diaHoy && mesNac === mesHoy;
      
      if (esCumpleanos) {
        console.log(`   🎉 ¡ES CUMPLEAÑOS!`);
      } else {
        console.log(`   ⚪ No es cumpleaños`);
      }
      
      return esCumpleanos;
    });
    
    console.log(`\n✅ Total cumpleañeros encontrados: ${cumpleaneros.length}`);
    console.log('=== FIN DEBUG ===\n');
    return cumpleaneros;
  }, [clientes]);

  const handleSearch = useCallback((searchTerm = '', zona = '', ultimaCompra = '') => {
    // Si no hay filtros, mostrar todos
    if (!searchTerm && !zona && !ultimaCompra) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtered = clientes.filter(cliente => {
      // 1. Filtro por zona
      if (zona && cliente.zona !== zona) {
        return false;
      }
      
      // 2. Filtro por última compra
      if (ultimaCompra) {
        if (cliente.ultimaCompra) {
          const fechaUltimaCompra = new Date(cliente.ultimaCompra);
          const hoy = new Date();
          const diferenciaDias = Math.floor((hoy - fechaUltimaCompra) / (1000 * 60 * 60 * 24));
          if (diferenciaDias < parseInt(ultimaCompra)) {
            return false;
          }
        }
        // Si no tiene fecha de compra, incluirlo de todas formas
      }
      
      // 3. Filtro por término de búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Búsqueda por nombre
        const nombreMatch = cliente.nombre && cliente.nombre.toLowerCase().includes(searchLower);
        // Búsqueda por apellido
        const apellidoMatch = cliente.apellido && cliente.apellido.toLowerCase().includes(searchLower);
        
        // Búsqueda por teléfono
        let telefonoMatch = false;
        const searchLimpio = searchTerm.replace(/\D/g, '');
        
        if (searchLimpio && cliente.telefono) {
          const telefonoLimpio = String(cliente.telefono).replace(/\D/g, '');
          
          // Buscar por número completo o parcial
          if (telefonoLimpio.includes(searchLimpio)) {
            telefonoMatch = true;
          }
          
          // O por últimos 4 dígitos
          if (searchLimpio.length <= 4 && searchLimpio.length > 0) {
            const ultimosDigitos = telefonoLimpio.slice(-searchLimpio.length);
            if (ultimosDigitos === searchLimpio) {
              telefonoMatch = true;
            }
          }
        }
        
        // Si no matchea ninguno, filtrar
        if (!nombreMatch && !apellidoMatch && !telefonoMatch) {
          return false;
        }
      }
      
      return true;
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

  const handleClienteContactado = useCallback((clienteID) => {
    showToast('Cliente marcado como contactado', 'success');
    
    // Actualización optimista: marcar cliente como contactado
    setClientes(prevClientes => 
      prevClientes.map(c => 
        c.id === clienteID 
          ? { ...c, contactado: 'Sí' }
          : c
      )
    );
    
    setClientesFiltrados(prevFiltrados => 
      prevFiltrados.map(c => 
        c.id === clienteID 
          ? { ...c, contactado: 'Sí' }
          : c
      )
    );
  }, [showToast]);

  const handleLogin = () => {
    setIsAuthenticated(true);
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
            {/* Logo/Título */}
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-terracotta-600" />
              <h1 className="text-xl font-bold text-stone-900">Gestión de Clientes</h1>
            </div>
            
            {/* Menú Hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors duration-200"
              aria-label="Menú"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-stone-700" />
              ) : (
                <Menu className="w-6 h-6 text-stone-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú Lateral */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-6">
              {/* Header del menú */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-stone-900">Menú</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-stone-700" />
                </button>
              </div>

              {/* Opciones del menú */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveView('clientes');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeView === 'clientes'
                      ? 'bg-terracotta-50 text-terracotta-700 shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>👥 Todos los clientes</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('cumpleanos');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeView === 'cumpleanos'
                      ? 'bg-terracotta-50 text-terracotta-700 shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Cake className="w-5 h-5" />
                  <span>🎂 Cumpleaños</span>
                  {clientesCumpleanosHoy.length > 0 && (
                    <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {clientesCumpleanosHoy.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveView('nuevos');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeView === 'nuevos'
                      ? 'bg-terracotta-50 text-terracotta-700 shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>🆕 Nuevos clientes</span>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

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

        {activeView === 'nuevos' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-stone-200/60">
            <Suspense fallback={
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 text-terracotta-600 animate-spin" />
              </div>
            }>
              <NewClientsView 
                clientes={clientesNuevos} 
                loading={loading}
                onClienteContactado={handleClienteContactado}
              />
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

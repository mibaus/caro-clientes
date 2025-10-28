import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

  const checkLockout = () => {
    const lockoutData = localStorage.getItem('loginLockout');
    if (lockoutData) {
      const { lockedUntil } = JSON.parse(lockoutData);
      if (Date.now() < lockedUntil) {
        const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
        return minutesLeft;
      } else {
        localStorage.removeItem('loginLockout');
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si está bloqueado
    const lockoutMinutes = checkLockout();
    if (lockoutMinutes) {
      setError(`Demasiados intentos fallidos. Intenta en ${lockoutMinutes} minuto(s).`);
      return;
    }

    setLoading(true);
    setError('');

    // Simular delay de validación (para evitar ataques de fuerza bruta)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validar contraseña
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      // Login exitoso
      if (rememberMe) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.setItem('isAuthenticated', 'true');
      }
      
      // Limpiar intentos
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginLockout');
      
      onLogin();
    } else {
      // Login fallido
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        // Bloquear por 15 minutos
        const lockedUntil = Date.now() + LOCKOUT_TIME;
        localStorage.setItem('loginLockout', JSON.stringify({ lockedUntil }));
        setError('Demasiados intentos fallidos. Bloqueado por 15 minutos.');
        setAttempts(0);
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        setError(`Contraseña incorrecta. Te quedan ${remainingAttempts} intento(s).`);
      }
    }

    setLoading(false);
    setPassword('');
  };

  // Cargar intentos previos
  useState(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-2xl shadow-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Gestión de Clientes
          </h1>
          <p className="text-stone-500">
            Ingresa tu contraseña para continuar
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-200/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-stone-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all duration-200 bg-white text-stone-900"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading || checkLockout() !== null}
                  autoFocus
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-terracotta-600 border-stone-300 rounded focus:ring-terracotta-400"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-stone-600">
                Recordar sesión
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || checkLockout() !== null}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Ingresar
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-xs text-center text-stone-400">
              Acceso exclusivo para personal autorizado
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500">
            🔒 Conexión segura • Datos protegidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

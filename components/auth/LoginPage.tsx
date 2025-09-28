import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/vendedor';
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'VENDEDOR', // Asigna el rol al registrarse
            },
          },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
           setError('Este correo electrónico ya está en uso por otro usuario.');
        } else {
           setMessage('¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.');
        }
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md">
      <Card title={isLogin ? 'Iniciar Sesión' : 'Registrar Vendedor'}>
        <form onSubmit={handleAuth} className="space-y-6">
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
          <Input
            label="Contraseña"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          {error && <Alert message={error} type="warning" />}
          {message && <Alert message={message} type="success" />}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Crear Cuenta'}
          </Button>
          <p className="text-center text-sm">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-renault-yellow hover:underline ml-1"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 text-center mb-3">Credenciales de Demostración</h4>
            <p className="text-xs text-gray-500 text-center mb-4">
                Para probar la aplicación, crea estos usuarios en tu panel de Supabase y asígnales el rol correspondiente en los <code className="text-xs bg-gray-200 p-1 rounded">user_metadata</code>.
            </p>
            <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-semibold text-gray-800">Rol: Administrador</p>
                    <p><strong>Usuario:</strong> <code className="text-blue-600">admin@demo.com</code></p>
                    <p><strong>Contraseña:</strong> <code className="text-blue-600">Interact2</code></p>
                    <p className="text-xs text-gray-500 mt-1">(Metadata: <code className="text-xs bg-gray-200 p-1 rounded">{`{ "role": "ADMIN" }`}</code>)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-semibold text-gray-800">Rol: Vendedor</p>
                    <p><strong>Usuario:</strong> <code className="text-blue-600">lugones@demo.com</code></p>
                    <p><strong>Contraseña:</strong> <code className="text-blue-600">150519</code></p>
                    <p className="text-xs text-gray-500 mt-1">(Metadata: <code className="text-xs bg-gray-200 p-1 rounded">{`{ "role": "VENDEDOR" }`}</code>)</p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
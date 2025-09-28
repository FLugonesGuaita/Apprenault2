import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client.js';
import Card from '../common/Card.js';
import Input from '../common/Input.js';
import Button from '../common/Button.js';
import Alert from '../common/Alert.js';
import { resolvePath } from '../../utils/path.js';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = resolvePath('/vendedor');
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
    } catch (err) {
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
            <h4 className="text-sm font-bold text-gray-700 text-center mb-3">Guía para Usuarios de Demostración</h4>
            <p className="text-xs text-center text-red-600 mb-3 font-semibold">IMPORTANTE: La interfaz de Supabase ha cambiado. Sigue estos pasos para asignar roles.</p>
            <ol className="list-decimal list-inside text-xs text-gray-600 space-y-2">
                <li>Primero, crea los usuarios de abajo en <strong>Authentication &gt; Users</strong>.</li>
                <li>Luego, ve al **Editor SQL** de tu proyecto Supabase (ícono de base de datos en el menú lateral).</li>
                <li>Copia y pega los siguientes comandos SQL uno por uno y haz clic en **"RUN"** para cada uno.</li>
            </ol>
            <div className="space-y-3 text-sm mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-semibold text-gray-800">1. Asignar Rol de Administrador</p>
                    <p className="text-xs text-gray-500 mt-1">Copia y ejecuta esto en el Editor SQL:</p>
                    <code className="block text-xs bg-gray-200 p-2 rounded mt-1 whitespace-pre-wrap w-full">
                      {`update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "ADMIN"}'
where email = 'admin@demo.com';`}
                    </code>
                    <p className="mt-2"><strong>Usuario:</strong> <code className="text-blue-600">admin@demo.com</code> / <strong>Pass:</strong> <code className="text-blue-600">Interact2</code></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-semibold text-gray-800">2. Asignar Rol de Vendedor</p>
                    <p className="text-xs text-gray-500 mt-1">Copia y ejecuta esto en el Editor SQL:</p>
                    <code className="block text-xs bg-gray-200 p-2 rounded mt-1 whitespace-pre-wrap w-full">
                      {`update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "VENDEDOR"}'
where email = 'lugones@demo.com';`}
                    </code>
                     <p className="mt-2"><strong>Usuario:</strong> <code className="text-blue-600">lugones@demo.com</code> / <strong>Pass:</strong> <code className="text-blue-600">150519</code></p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
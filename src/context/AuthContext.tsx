import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  username: string;
  id?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, authCode: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<{ secretKey: string, instrucciones: string[] }>;
  logout: () => void;
  getLogs: () => Promise<any[]>;
  getLogStats: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_URL = 'https://backend-seguridad-gzhy.onrender.com';
  const LOGS_URL = `${API_URL}/logs/stats`;
  const ALL_LOGS_URL = `${API_URL}/logs/all`;

  const getLogs = async () => {
    try {
      const response = await axios.get(ALL_LOGS_URL);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los logs');
    }
  };

  const getLogStats = async () => {
    try {
      const response = await axios.get(LOGS_URL);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las estadísticas');
    }
  };

  const login = async (email: string, password: string, authCode: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        token: authCode
      });

      if (response.data.token) {
        await handleAuthSuccess(response.data.token);
      } else {
        throw new Error(response.data.message || 'Error en la autenticación');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  };

  const handleAuthSuccess = async (newToken: string) => {
    try {
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Token inválido o no proporcionado');
      }

      const decoded = jwtDecode<User>(newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (error: any) {
      setToken(null);
      setUser(null);
      throw new Error('Error al procesar el token de autenticación');
    }
  };

  const register = async (email: string, username: string, password: string): Promise<{ secretKey: string, instrucciones: string[] }> => {
    try {
      if (!email || !username || !password) {
        throw new Error('Todos los campos son requeridos');
      }

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        throw new Error('Formato de correo electrónico inválido');
      }

      const requestData = {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        password
      };

      const response = await axios.post(`${API_URL}/register`, requestData);

      if (!response.data?.secretKey) {
        throw new Error('El servidor no devolvió la información necesaria');
      }

      return {
        secretKey: response.data.secretKey,
        instrucciones: [
          'Descarga Microsoft Authenticator en tu dispositivo móvil',
          'Escanea el código QR o ingresa la clave secreta manualmente',
          'Una vez configurado, podrás iniciar sesión usando el código generado'
        ]
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      getLogs,
      getLogStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};
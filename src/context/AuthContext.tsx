import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { io, Socket } from 'socket.io-client';

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
  socket: Socket | null;
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
  const [socket, setSocket] = useState<Socket | null>(null);

  const API_URL = 'https://backend-seguridad-gzhy.onrender.com';
  const LOGS_URL = `${API_URL}/logs/stats`;
  const ALL_LOGS_URL = `${API_URL}/logs/all`;

  
  useEffect(() => {
    const newSocket = io(API_URL);
    
    newSocket.on('connect', () => {
      console.log('Conectado a Socket.io');
    });
    
    newSocket.on('authCode', (data) => {
      console.log('Código de autenticación recibido:', data);
      alert(`${data.message}: ${data.code}`);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Desconectado de Socket.io');
    });
    
    setSocket(newSocket);
    
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  
  const getLogs = async () => {
    try {
      const response = await axios.get(ALL_LOGS_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener logs:', error);
      throw new Error('Error al obtener los logs');
    }
  };

  const getLogStats = async () => {
    try {
      const response = await axios.get(LOGS_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('Error al obtener las estadísticas');
    }
  };

  const login = async (email: string, password: string, authCode: string) => {
    try {
      console.log('Iniciando login con:', {
        email,
        hasAuthCode: !!authCode,
        timestamp: new Date().toISOString()
      });

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        token: authCode
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        success: response.data.success,
        hasToken: !!response.data.token,
        timestamp: new Date().toISOString()
      });

      if (response.data.token) {
        await handleAuthSuccess(response.data.token);
      } else {
        throw new Error(response.data.message || 'Error en la autenticación');
      }
    } catch (error: any) {
      console.error('Error en login:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        timestamp: new Date().toISOString()
      });
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  };

  const handleAuthSuccess = async (newToken: string) => {
    try {
      console.log('Procesando token:', {
        tokenLength: newToken?.length,
        tokenType: typeof newToken,
        timestamp: new Date().toISOString()
      });

      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Token inválido o no proporcionado');
      }

      const decoded = jwtDecode<User>(newToken);
      console.log('Token decodificado:', {
        email: decoded.email,
        username: decoded.username,
        id: decoded.id,
        timestamp: new Date().toISOString()
      });

      setToken(newToken);
      setUser(decoded);
      console.log('Estado actualizado con éxito');
    } catch (error: any) {
      console.error('Error en handleAuthSuccess:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      setToken(null);
      setUser(null);
      throw new Error('Error al procesar el token de autenticación');
    }
  };

  const register = async (email: string, username: string, password: string): Promise<{ secretKey: string, instrucciones: string[] }> => {
    try {
      console.log('Iniciando proceso de registro con datos:', {
        email: email,
        username: username,
        passwordLength: password?.length,
        timestamp: new Date().toISOString()
      });

      // Validación básica antes de enviar
      if (!email || !username || !password) {
        console.warn('Validación fallida - campos vacíos:', {
          hasEmail: !!email,
          hasUsername: !!username,
          hasPassword: !!password
        });
        throw new Error('Todos los campos son requeridos');
      }

      // Validación de formato de correo
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      console.log('Validación de email:', {
        email: email,
        isValid: isValidEmail,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.source
      });

      if (!isValidEmail) {
        throw new Error('Formato de correo electrónico inválido');
      }

      const requestData = {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        password
      };

      console.log('Enviando solicitud al servidor:', {
        url: `${API_URL}/register`,
        data: { ...requestData, password: '***' },
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await axios.post(`${API_URL}/register`, requestData);

      console.log('Respuesta completa del servidor:', response.data);

      // Modificar esta validación para usar secretKey en lugar de secret
      if (!response.data?.secretKey) {
        console.error('Respuesta sin secretKey:', response.data);
        throw new Error('El servidor no devolvió la información necesaria');
      }

      return {
        secretKey: response.data.secretKey, // Cambiado de secret a secretKey
        instrucciones: [
          'Descarga Microsoft Authenticator en tu dispositivo móvil',
          'Escanea el código QR o ingresa la clave secreta manualmente',
          'Una vez configurado, podrás iniciar sesión usando el código generado'
        ]
      };
    } catch (error: any) {
      console.error('Error detallado en registro:', {
        name: error.name,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestData: error.config?.data,
        headers: error.config?.headers,
        timestamp: new Date().toISOString()
      });

      if (error.response?.status === 400) {
        throw new Error(`Error en la solicitud: ${error.response?.data?.message || 'Datos inválidos'}`);
      }
      if (error.response?.status === 500) {
        throw new Error('Error en el servidor. Por favor, intente más tarde o contacte al administrador.');
      }
      throw new Error(error.message || 'Error en el registro. Por favor, verifique sus datos.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getLogs,
        getLogStats,
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

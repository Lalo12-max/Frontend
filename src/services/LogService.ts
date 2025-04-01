import axios from 'axios';

interface LogEntry {
  user_id?: number;
  method: string;
  path: string;
  status_code: number;
  response_time: string;
  ip_address: string;
  user_agent: string;
  request_body?: string;
  query_params?: string;
  hostname: string;
  protocol: string;
  environment: string;
  node_version: string;
  process_id: number;
}

class LogService {
  private static API_URL = import.meta.env.VITE_API_URL;

  static async logRequest(data: Partial<LogEntry>) {
    try {
      const logEntry = {
        ...data,
        user_agent: window.navigator.userAgent,
        hostname: window.location.hostname,
        protocol: window.location.protocol.replace(':', ''),
        environment: import.meta.env.MODE,
        node_version: process.versions.node || 'unknown',
        process_id: Math.floor(Math.random() * 10000), // Simulado para el frontend
        timestamp: new Date().toISOString()
      };

      await axios.post(`${this.API_URL}/logs`, logEntry);
    } catch (error) {
      console.error('Error al guardar el log:', error);
    }
  }
}

export default LogService;
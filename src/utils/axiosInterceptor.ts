import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import LogService from '../services/LogService';

// Define custom interface for our config
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Interceptor para las peticiones
axios.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomInternalAxiosRequestConfig;
    const startTime = config.metadata?.startTime;
    const endTime = new Date();
    const responseTime = startTime ? endTime.getTime() - startTime.getTime() : 0;

    LogService.logRequest({
      method: response.config.method?.toUpperCase() || 'UNKNOWN',
      path: response.config.url || '',
      status_code: response.status,
      response_time: `${responseTime}ms`,
      request_body: JSON.stringify(response.config.data) || '',
      query_params: response.config.params ? JSON.stringify(response.config.params) : ''
    });

    return response;
  },
  (error) => {
    const startTime = error.config?.metadata?.startTime;
    const endTime = new Date();
    const responseTime = startTime ? endTime.getTime() - startTime.getTime() : 0;

    LogService.logRequest({
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      path: error.config?.url || '',
      status_code: error.response?.status || 500,
      response_time: `${responseTime}ms`,
      request_body: JSON.stringify(error.config?.data) || '',
      query_params: error.config?.params ? JSON.stringify(error.config?.params) : ''
    });

    return Promise.reject(error);
  }
);
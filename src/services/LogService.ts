import axios from 'axios';

interface FrontendLog {
  user_id?: number;
  event_type: string;
  component_name: string;
  action_description: string;
  browser_info: string;
  screen_resolution: string;
  user_language: string;
  page_url: string;
  error_message?: string;
  stack_trace?: string;
  performance_metrics?: any;
  user_interaction_data?: any;
}

class LogService {
  private static API_URL = 'https://backend-seguridad-gzhy.onrender.com';

  static async logEvent(logData: Partial<FrontendLog>) {
    try {
      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        url: window.location.href
      };

      const logPayload = {
        ...logData,
        browser_info: JSON.stringify(browserInfo),
        screen_resolution: browserInfo.screenResolution,
        user_language: browserInfo.language,
        page_url: browserInfo.url,
        timestamp: new Date().toISOString()
      };

      await axios.post(`${this.API_URL}/frontend-logs`, logPayload);
    } catch (error) {
      console.error('Error al guardar log:', error);
    }
  }
}

export default LogService;
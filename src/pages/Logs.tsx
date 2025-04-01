import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Logs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [logStats, setLogStats] = useState<any>(null);

  useEffect(() => {
    const fetchLogStats = async () => {
      try {
        console.log('Fetching log stats with token:', token);
        const response = await axios.get('https://backend-seguridad-gzhy.onrender.com/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Log stats response:', response.data);
        
        // Verify the structure of the response
        console.log('Response structure:', {
          hasData: !!response.data,
          statusCodes: response.data?.byStatusCode,
          successCount: response.data?.successCount,
          errorCount: response.data?.errorCount
        });

        setLogStats(response.data);
      } catch (error: any) {
        console.error('Error fetching log stats:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };

    fetchLogStats();
  }, [token]);

  // Add console log to check chartData structure
  useEffect(() => {
    console.log('Current logStats:', logStats);
    console.log('Chart data structure:', {
      labels: logStats ? Object.keys(logStats.byStatusCode) : [],
      data: logStats ? Object.values(logStats.byStatusCode) : []
    });
  }, [logStats]);

  const chartData = {
    labels: logStats ? Object.keys(logStats.byStatusCode) : [],
    datasets: [
      {
        label: 'Número de Logs por Código de Estado',
        data: logStats ? Object.values(logStats.byStatusCode) : [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Logs por Código de Estado',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Estadísticas de Logs
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Regresar a Home
          </Button>
        </Box>
        
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          {logStats ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              <Typography>
                Logs exitosos: {logStats.successCount}
              </Typography>
              <Typography>
                Logs de error: {logStats.errorCount}
              </Typography>
              
              <Box sx={{ mt: 4, height: 400 }}>
                <Bar options={options} data={chartData} />
              </Box>
            </Box>
          ) : (
            <Typography>Cargando estadísticas...</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Logs;
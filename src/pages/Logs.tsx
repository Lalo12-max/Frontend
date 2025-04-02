import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
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

// Create a custom grid layout using styled components
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
}));

const GridItem = styled(Box)(({ theme }) => ({
  flex: '1 1 100%',
  [theme.breakpoints.up('md')]: {
    flex: '1 1 calc(50% - 12px)',
  },
}));

interface LogData {
  status_code: number;
  count: string;
  date: string;
}

const Logs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [securityLogStats, setSecurityLogStats] = useState<any>(null);
  const [rateLimitLogStats, setRateLimitLogStats] = useState<any>(null);

  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        // Fetch logs from security backend
        const securityResponse = await axios.get('https://backend-seguridad-gzhy.onrender.com/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Security Response:', securityResponse.data);
        
        // Transform security logs data
        const securityData: LogData[] = securityResponse.data;
        const transformedSecurityData = transformLogData(securityData);
        console.log('Transformed Security Data:', transformedSecurityData);
        setSecurityLogStats(transformedSecurityData);

        // Fetch logs from rate limit backend
        const rateLimitResponse = await axios.get('https://back-ratelimit.onrender.com/rate/logs/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Rate Limit Response:', rateLimitResponse.data);
        
        // Transform rate limit logs data
        const rateLimitData: LogData[] = rateLimitResponse.data;
        const transformedRateLimitData = transformLogData(rateLimitData);
        console.log('Transformed Rate Limit Data:', transformedRateLimitData);
        setRateLimitLogStats(transformedRateLimitData);

      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchAllLogs();
  }, [token]);

  const transformLogData = (data: LogData[]) => ({
    byStatusCode: data.reduce((acc, item) => {
      acc[item.status_code] = parseInt(item.count);
      return acc;
    }, {} as Record<number, number>),
    successCount: data.reduce((acc, item) => 
      item.status_code < 400 ? acc + parseInt(item.count) : acc, 0),
    errorCount: data.reduce((acc, item) => 
      item.status_code >= 400 ? acc + parseInt(item.count) : acc, 0)
  });

  const createChartData = (logStats: any, title: string) => ({
    labels: logStats ? Object.keys(logStats.byStatusCode) : [],
    datasets: [
      {
        label: title,
        data: logStats ? Object.values(logStats.byStatusCode) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const options = (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Comparación de Logs
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Regresar a Home
          </Button>
        </Box>
        
        <GridContainer>
          {/* Security Logs */}
          <GridItem>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Backend de Seguridad
              </Typography>
              {securityLogStats ? (
                <Box>
                  <Typography>
                    Logs exitosos: {securityLogStats.successCount}
                  </Typography>
                  <Typography>
                    Logs de error: {securityLogStats.errorCount}
                  </Typography>
                  <Box sx={{ mt: 4, height: 300 }}>
                    <Bar 
                      options={options('Distribución de Logs - Seguridad')} 
                      data={createChartData(securityLogStats, 'Logs de Seguridad')} 
                    />
                  </Box>
                </Box>
              ) : (
                <Typography>Cargando estadísticas...</Typography>
              )}
            </Paper>
          </GridItem>

          {/* Rate Limit Logs */}
          <GridItem>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Backend de Rate Limit
              </Typography>
              {rateLimitLogStats ? (
                <Box>
                  <Typography>
                    Logs exitosos: {rateLimitLogStats.successCount}
                  </Typography>
                  <Typography>
                    Logs de error: {rateLimitLogStats.errorCount}
                  </Typography>
                  <Box sx={{ mt: 4, height: 300 }}>
                    <Bar 
                      options={options('Distribución de Logs - Rate Limit')} 
                      data={createChartData(rateLimitLogStats, 'Logs de Rate Limit')} 
                    />
                  </Box>
                </Box>
              ) : (
                <Typography>Cargando estadísticas...</Typography>
              )}
            </Paper>
          </GridItem>
        </GridContainer>
      </Box>
    </Container>
  );
};

export default Logs;
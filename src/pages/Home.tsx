import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenido a nuestra aplicación
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Una plataforma segura con autenticación de dos factores
        </Typography>
        <Box sx={{ mt: 4 }}>
          {!isAuthenticated ? (
            <Box sx={{ '& > *': { mx: 1 } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                size="large"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/register')}
                size="large"
              >
                Registrarse
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
              size="large"
            >
              Ir al Dashboard
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
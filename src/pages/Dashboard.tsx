import { Container, Box, Typography, Paper, Divider } from '@mui/material';

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            HOME
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/logs')}
          >
            Ver Logs
          </Button>
        </Box>
        

        <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información del Proyecto
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            <strong>Alumno:</strong> EDUARDO ALEJANDRO CABELLO HERNANDEZ
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Docente:</strong> Emmanuel Martínez Hernández
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Grado:</strong> Técnico Superior Universitario
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Grupo:</strong> IDGS11
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Descripción de la Aplicación
          </Typography>
          <Typography variant="body1" paragraph>
            Esta aplicación implementa un sistema de autenticación seguro con doble factor (2FA) 
            utilizando React y TypeScript en el frontend, y Node.js en el backend. El sistema permite 
            a los usuarios registrarse, iniciar sesión de forma segura utilizando un código de 
            autenticación generado por una aplicación como Microsoft Authenticator, y acceder a 
            información protegida una vez autenticados.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
import { Alert, Box, Typography } from '@mui/material';

interface RegisterAlertProps {
  secretKey: string;
  instrucciones: string[]; // Keeping this for compatibility with parent component
  onClose: () => void;
}

const RegisterAlert = ({ secretKey, onClose }: RegisterAlertProps) => {
  return (
    <Alert 
      severity="success" 
      onClose={onClose}
      sx={{ 
        mb: 3, 
        width: '100%',
        '& .MuiAlert-message': { width: '100%' }
      }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        Usuario registrado exitosamente
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Tu clave secreta:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            p: 1, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            fontFamily: 'monospace',
            wordBreak: 'break-all'
          }}
        >
          {secretKey}
        </Typography>
      </Box>
      
      {/* Se ha eliminado la sección de instrucciones */}
    </Alert>
  );
};

export default RegisterAlert;
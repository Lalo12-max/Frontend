import { Alert, Box, Typography, List, ListItem } from '@mui/material';

interface RegisterAlertProps {
  secretKey: string;
  instrucciones: string[];
  onClose: () => void;
}

const RegisterAlert = ({ secretKey, instrucciones, onClose }: RegisterAlertProps) => {
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
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Instrucciones:
        </Typography>
        <List dense sx={{ pl: 2 }}>
          {instrucciones.map((instruccion, index) => (
            <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'decimal' }}>
              {instruccion}
            </ListItem>
          ))}
        </List>
      </Box>
    </Alert>
  );
};

export default RegisterAlert;
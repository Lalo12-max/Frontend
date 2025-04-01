import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SocketNotification = () => {
  const { socket } = useAuth();
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('authCode', (data) => {
      setNotification({
        open: true,
        message: `${data.message}: ${data.code}`,
        severity: 'info'
      });
    });

    return () => {
      socket.off('authCode');
    };
  }, [socket]);

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={notification.severity}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default SocketNotification;
import React, { useEffect, useRef, useCallback } from 'react';
import NotificationAlert from 'react-notification-alert';

const Notificaciones = () => {
  const notificationAlertRef = useRef(null);

  const notify = (message) => {
    const options = {
      place: 'tc',  
      message: <div>{message}</div>,
      type: 'danger',
      icon: 'nc-icon nc-alert-circle-i',
      autoDismiss: 5,
      closeButton: true, 
      zIndex: 1050,  
    };

    if (notificationAlertRef.current) {
      notificationAlertRef.current.notificationAlert(options);
    }
  };

  const checkValues = useCallback(async () => {
    const endpoints = [
      '/bus_dc_danfoss',
      '/frec_salida_danfoss',
      '/temperatura_vfd',
      '/corriente',
      '/voltage_motor',
      '/potencia_hp',
      '/potencia_kw',
      '/ai',
      '/av'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3001${endpoint}`);
        const data = await response.json();
        if (data.message) {
          notify(data.message); 
        }
      } catch (error) {
        console.error(`Error al obtener datos de ${endpoint}:`, error);
      }
    }
  }, []); 

  useEffect(() => {
    checkValues(); 

  }, [checkValues]); 

  return (
    <div>
      <NotificationAlert ref={notificationAlertRef} />
    </div>
  );
};

export default Notificaciones;

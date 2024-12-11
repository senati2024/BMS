
    // Ruta para obtener el valor de la bus_dc_danfoss
    app.get('/bus_dc_danfoss', (req, res) => {
        connection.query(
          'SELECT bus_dc_danfoss FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
          (error, results) => {
            if (error) {
              return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length > 0) {
              const bus_dc_danfoss = results[0].bus_dc_danfoss;
              if (bus_dc_danfoss > 30) {
                res.json({ message: `Bus_dc_danfoss fuera de rango: ${bus_dc_danfoss} ` });
              } else {
                res.status(204).send();  
              }
            } else {
              res.json({ message: 'No se encontraron registros de bus_dc_danfoss' });
            }
          }
        );
      });
      
    // Ruta para obtener el valor de la frec_salida_danfoss
    app.get('/frec_salida_danfoss', (req, res) => {
        connection.query(
          'SELECT frec_salida_danfoss FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
          (error, results) => {
            if (error) {
              return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length > 0) {
              const frec_salida_danfoss = results[0].frec_salida_danfoss;
              if (frec_salida_danfoss > 30) {
                res.json({ message: `Frec_salida_danfoss fuera de rango: ${frec_salida_danfoss} ` });
              } else {
                res.status(204).send();  
              }
            } else {
              res.json({ message: 'No se encontraron registros de frec_salida_danfoss' });
            }
          }
        );
      });
  
    // Ruta para obtener el valor de la temperatura_vfd
    app.get('/temperatura_vfd', (req, res) => {
        connection.query(
          'SELECT temperatura_vfd FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
          (error, results) => {
            if (error) {
              return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length > 0) {
              const temperatura_vfd = results[0].temperatura_vfd;
              if (temperatura_vfd > 30) {
                res.json({ message: `Temperatura_vfd fuera de rango: ${temperatura_vfd} vfd` });
              } else {
                res.status(204).send();  
              }
            } else {
              res.json({ message: 'No se encontraron registros de temperatura_vfd' });
            }
          }
        );
      });

  // Ruta para obtener el valor de la corriente
  app.get('/corriente', (req, res) => {
    connection.query(
      'SELECT corriente FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length > 0) {
          const corriente = results[0].corriente;
          if (corriente > 30) {
            res.json({ message: `Corriente fuera de rango: ${corriente} ` });
          } else {
            res.status(204).send();  
          }
        } else {
          res.json({ message: 'No se encontraron registros de corriente' });
        }
      }
    );
  });

     // Ruta para obtener el valor de la voltage_motor
    app.get('/voltage_motor', (req, res) => {
        connection.query(
          'SELECT voltage_motor FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
          (error, results) => {
            if (error) {
              return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length > 0) {
              const voltage_motor = results[0].voltage_motor;
              if (voltage_motor > 30) {
                res.json({ message: `Voltage_motor fuera de rango: ${voltage_motor} ` });
              } else {
                res.status(204).send();  
              }
            } else {
              res.json({ message: 'No se encontraron registros de voltage_motor' });
            }
          }
        );
      });
      
     // Ruta para obtener el valor de la potencia_hp
     app.get('/potencia_hp', (req, res) => {
        connection.query(
          'SELECT potencia_hp FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
          (error, results) => {
            if (error) {
              return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length > 0) {
              const potencia_hp = results[0].potencia_hp;
              if (potencia_hp > 30) {
                res.json({ message: `Potencia_hp fuera de rango: ${potencia_hp} hp` });
              } else {
                res.status(204).send();  
              }
            } else {
              res.json({ message: 'No se encontraron registros de potencia_hp' });
            }
          }
        );
      });
  
// Ruta para obtener el valor de la potencia_kw
app.get('/potencia_kw', (req, res) => {
    connection.query(
      'SELECT potencia_kw FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length > 0) {
          const potencia_kw = results[0].potencia_kw;
          if (potencia_kw > 45) {
            res.json({ message: `Potencia fuera de rango: ${potencia_kw} kW` });
          } else {
            res.status(204).send();  
          }
        } else {
          res.json({ message: 'No se encontraron registros de potencia_kw' });
        }
      }
    );
  });

// Ruta para obtener el valor de la ai
app.get('/ai', (req, res) => {
    connection.query(
      'SELECT ai FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length > 0) {
          const ai = results[0].ai;
          if (ai > 45) {
            res.json({ message: `AI fuera de rango: ${ai} ` });
          } else {
            res.status(204).send();  
          }
        } else {
          res.json({ message: 'No se encontraron registros de ai' });
        }
      }
    );
  });
  
// Ruta para obtener el valor de la av
app.get('/av', (req, res) => {
    connection.query(
      'SELECT av FROM presurizacion ORDER BY timestamp DESC LIMIT 1',
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length > 0) {
          const av = results[0].av;
          if (av > 45) {
            res.json({ message: `AV fuera de rango: ${av} ` });
          } else {
            res.status(204).send();  
          }
        } else {
          res.json({ message: 'No se encontraron registros de av' });
        }
      }
    );
  });
  
  
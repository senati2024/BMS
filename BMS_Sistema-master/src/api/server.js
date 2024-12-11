const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const generarPDF = require("./pdfGenerator"); 

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Necesario para leer JSON en el body de las peticiones

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "usbw",
  database: "sistemapresurizacion",
});

// Ruta para obtener el estado del LED
app.get("/led-status", (req, res) => {
  connection.query(
    "SELECT color FROM indicadores ORDER BY timestamp DESC LIMIT 1",
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length > 0) {
        res.json({ color: results[0].color });
      } else {
        res.json({ color: "rojo" }); // Valor por defecto si no hay resultados
      }
    }
  );
});

// Ruta para recibir comandos desde el frontend y almacenarlos en la base de datos
app.post("/send-command", (req, res) => {
  const { dispositivo, comando, estado } = req.body;

  if (!dispositivo || !comando || !estado) {
    return res.status(400).json({ error: "Datos incompletos en la solicitud" });
  }

  const query = `
    INSERT INTO control_comandos (dispositivo, comando, estado)
    VALUES (?, ?, ?)
  `;
  connection.query(query, [dispositivo, comando, estado], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al guardar el comando en la base de datos" });
    }
    res.status(201).json({ message: "Comando guardado correctamente" });
  });
});

// Ruta para obtener el estado de los dispositivos
app.get("/device-status", (req, res) => {
  const dispositivos = ["Variador", "Rele 1", "Ramp", "Reverse"];
  const promises = dispositivos.map((dispositivo) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT estado FROM control_comandos WHERE dispositivo = ? ORDER BY timestamp DESC LIMIT 1",
        [dispositivo],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve({ dispositivo, estado: results[0]?.estado || "OFF" });
        }
      );
    })
  );

  Promise.all(promises)
    .then((results) => res.json(results))
    .catch(() => res.status(500).json({ error: "Error en la base de datos" }));
});

// Ruta para obtener los indicadores desde la base de datos
app.get("/indicadores", (req, res) => {
  connection.query(
    "SELECT tensionMotor, tensionDC, corriente, potencia, frecuencia, temperatura, ia, av FROM presurizacion ORDER BY timestamp DESC LIMIT 1",
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      res.json(
        results[0] || {
          tensionMotor: 0,
          tensionDC: 0,
          corriente: 0,
          potencia: 0,
          frecuencia: 0,
          temperatura: 0,
          ia: 0,
          av: 0,
        }
      );
    }
  );
});

// Ruta para generar y enviar el PDF con un rango de fechas
app.post("/enviar-pdf", (req, res) => {
  const { email, startDate, endDate } = req.body;

  if (!email || !startDate || !endDate) {
    return res.status(400).json({ error: "Correo y fechas son necesarios para enviar el reporte" });
  }

  const formattedStartDate = startDate + " 00:00:00";
  const formattedEndDate = endDate + " 23:59:59";

  connection.query(
    "SELECT * FROM presurizacion WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC",
    [formattedStartDate, formattedEndDate],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No se encontraron registros para el rango de fechas proporcionado" });
      }
      const pdfPath = await generarPDF(results, { startDate, endDate });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "santiagozavaletav@gmail.com",
          pass: "ynjw mdlg zdav tqfs",
        },
        tls: {
          rejectUnauthorized: false, 
        },
      });
      

      const mailOptions = {
        from: "santiagozavaletav@gmail.com",  
        to: email,
        subject: "Reporte de Registros - Fechas seleccionadas",
        text: "Adjunto encontrarás el reporte con los registros solicitados.",
        attachments: [{ filename: `registro_${startDate}_${endDate}.pdf`, path: pdfPath }],
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).json({ error: "Error al enviar el correo" });
        }
        res.status(200).json({ message: "Correo enviado correctamente" });
      });
    }
  );
});


// Ruta para obtener registros en rango de fechas
app.get("/registros-en-rango", (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Las fechas de inicio y fin son necesarias" });
  }

  const formattedStartDate = startDate + " 00:00:00";
  const formattedEndDate = endDate + " 23:59:59";

  connection.query(
    "SELECT * FROM presurizacion WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC",
    [formattedStartDate, formattedEndDate],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      res.status(200).json(results);
    }
  );
});

// Rutas para consultar valores específicos
const obtenerValor = (campo, rangoMaximo, res) => {
  connection.query(
    `SELECT ${campo} FROM presurizacion ORDER BY timestamp DESC LIMIT 1`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length > 0) {
        const valor = results[0][campo];
        if (valor > rangoMaximo) {
          return res.json({ message: `${campo} fuera de rango: ${valor}` });
        }
        return res.status(204).send();
      }
      res.json({ message: `No se encontraron registros de ${campo}` });
    }
  );
};

app.get("/bus_dc_danfoss", (req, res) => obtenerValor("bus_dc_danfoss", 30, res));
app.get("/frec_salida_danfoss", (req, res) => obtenerValor("frec_salida_danfoss", 30, res));
app.get("/temperatura_vfd", (req, res) => obtenerValor("temperatura_vfd", 30, res));
app.get("/corriente", (req, res) => obtenerValor("corriente", 30, res));
app.get("/voltage_motor", (req, res) => obtenerValor("voltage_motor", 30, res));
app.get("/potencia_hp", (req, res) => obtenerValor("potencia_hp", 30, res));
app.get("/potencia_kw", (req, res) => obtenerValor("potencia_kw", 45, res));
app.get("/ai", (req, res) => obtenerValor("ai", 45, res));
app.get("/av", (req, res) => obtenerValor("av", 45, res));

app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
});
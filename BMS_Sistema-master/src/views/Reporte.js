import React, { useState } from 'react';
import Axios from 'axios';
import 'assets/css/Calendario.css';
import { Button, Input, Card, CardHeader, CardBody, Row, Col, Table } from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

registerLocale('es', es);

const Reporte = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);  // Fecha de inicio
  const [endDate, setEndDate] = useState(null);      // Fecha de fin
  const [registros, setRegistros] = useState([]);    // Registros obtenidos de la base de datos

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo) => {
    if (tipo === 'success') {
      toast.success(mensaje, { autoClose: 5000 });
    } else {
      toast.error(mensaje, { autoClose: 5000 });
    }
  };

  // Función para limpiar el formulario y la tabla
  const limpiarCampos = () => {
    setEmail('');
    setStartDate(null);
    setEndDate(null);
    setRegistros([]);
    mostrarNotificacion('Campos limpiados con éxito', 'success');
  };

  // Función para generar y enviar el reporte PDF
  const enviarReporte = async () => {
    if (!email) {
      mostrarNotificacion('Por favor, ingresa un correo válido', 'error');
      return;
    }

    if (!startDate || !endDate) {
      mostrarNotificacion('Por favor, selecciona un rango de fechas', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await Axios.post('http://localhost:3001/enviar-pdf', {
        email,
        startDate: startDate.toISOString().split('T')[0],  // Formato YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0],      // Formato YYYY-MM-DD
      });

      mostrarNotificacion(response.data.message, 'success');
    } catch (error) {
      mostrarNotificacion('Hubo un error al generar o enviar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para consultar registros en el rango de fechas
  const obtenerRegistros = async () => {
    if (!startDate || !endDate) {
      mostrarNotificacion('Por favor, selecciona un rango de fechas', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await Axios.get('http://localhost:3001/registros-en-rango', {
        params: {
          startDate: startDate.toISOString().split('T')[0],  // Formato YYYY-MM-DD
          endDate: endDate.toISOString().split('T')[0],      // Formato YYYY-MM-DD
        }
      });

      setRegistros(response.data);
      mostrarNotificacion('Registros obtenidos con éxito', 'success');
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Hubo un error al obtener los registros', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Obtener las claves (columnas) de los registros
  const obtenerColumnas = () => {
    if (registros.length === 0) return [];
    return Object.keys(registros[0]);
  };

  return (
    <div className="content">
      <ToastContainer /> {/* Contenedor para las notificaciones */}
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title text-white">Generar y Consultar Reportes</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <Input
                    type="email"
                    placeholder="Ingresa el correo para enviar el reporte"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Col>
                <Col md="6">
                  <Button
                    color="primary"
                    onClick={enviarReporte}
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Reporte'}
                  </Button>
                </Col>
              </Row>

              {/* Calendario para seleccionar el rango de fechas */}
              <Row className="mt-3">
                <Col md="6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona la fecha de inicio"
                    className="form-control"
                    locale="es"
                  />
                </Col>
                <Col md="6">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona la fecha de fin"
                    className="form-control"
                    locale="es"
                  />
                </Col>
              </Row>

              {/* Botones adicionales */}
              <Row className="mt-3">
                <Col md="6">
                  <Button
                    color="info"
                    onClick={obtenerRegistros}
                    disabled={loading}
                    block
                  >
                    {loading ? 'Consultando...' : 'Consultar Registros'}
                  </Button>
                </Col>
                <Col md="6">
                  <Button
                    color="secondary"
                    onClick={limpiarCampos}
                    block
                  >
                    Limpiar Campos
                  </Button>
                </Col>
              </Row>

              {/* Tabla para mostrar los registros */}
              {registros.length > 0 && (
                <Row className="mt-4">
                  <Col md="12">
                    <Table responsive striped>
                      <thead>
                        <tr>
                          {/* Generamos los encabezados de manera dinámica */}
                          {obtenerColumnas().map((columna) => (
                            <th key={columna}>{columna}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {registros.map((registro) => (
                          <tr key={registro.id}>
                            {/* Generamos las celdas de manera dinámica */}
                            {obtenerColumnas().map((columna) => (
                              <td key={columna}>{registro[columna]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reporte;

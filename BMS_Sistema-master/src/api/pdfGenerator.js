const PDFDocument = require("pdfkit");
const fs = require("fs");
const { format } = require("date-fns");

function generarPDF(datos, { startDate, endDate }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "letter", layout: "landscape" }); // Configura orientación horizontal
    const pdfPath = `registros_${startDate}_${endDate}.pdf`;

    // Formatear las fechas a 'YYYY-MM-DD HH:mm:ss'
    const formattedStartDate = format(new Date(startDate), "yyyy-MM-dd HH:mm:ss");
    const formattedEndDate = format(new Date(endDate), "yyyy-MM-dd HH:mm:ss");

    // Crear stream para guardar el archivo
    const stream = doc.pipe(fs.createWriteStream(pdfPath));

    // Logo en la esquina superior izquierda
    const logoPath = "src/assets/img/logo.png"; // Reemplaza con la ruta de tu logo
    doc.image(logoPath, 30, 30, { width: 50 }); // Ajusta el tamaño y la posición del logo

    // Título
    doc.fontSize(18).text("Reporte de Registros", { align: "center" });
    doc.fontSize(12).text(
      `Fecha de inicio: ${formattedStartDate} | Fecha de fin: ${formattedEndDate}`,
      { align: "center" }
    );
    doc.moveDown(2);

    // Estilo de la tabla
    const columnWidths = [
      40,  // ID
      100, // Timestamp
      80,  // Bus DC Danfoss
      80,  // Frec Salida Danfoss
      60,  // Temp VFD
      60,  // Corriente
      80,  // Voltage Motor
      60,  // Potencia HP
      60,  // Potencia kW
      40,  // AI
      40,  // AV
    ];
    const tableStartX = 50; // Posición X de la tabla
    const tableStartY = 150; // Posición Y de la tabla
    const rowHeight = 20; // Altura de cada fila
    const headerHeight = 25; // Altura de la cabecera

    // Dibujar la cabecera de la tabla
    doc.rect(
      tableStartX,
      tableStartY,
      columnWidths.reduce((a, b) => a + b, 0),
      headerHeight
    ).stroke();
    const headers = [
      "ID",
      "Timestamp",
      "Bus DC Danfoss",
      "Frec Salida Danfoss",
      "Temp VFD",
      "Corriente",
      "Voltage Motor",
      "Potencia HP",
      "Potencia kW",
      "AI",
      "AV",
    ];

    // Dibujar encabezados con ajuste de texto
    headers.forEach((header, index) => {
      const x =
        tableStartX +
        columnWidths.slice(0, index).reduce((a, b) => a + b, 0) +
        5;
      const y = tableStartY + 5;

      // Dividir encabezados largos
      const words = header.split(" ");
      const text = words.length > 1 ? `${words[0]}\n${words.slice(1).join(" ")}` : header;

      // Reducir tamaño de fuente para cabecera
      doc.fontSize(9).text(text, x, y, { width: columnWidths[index] - 10, align: "center", lineGap: 2 });
    });

    doc.moveDown();

    // Dibujar filas de la tabla
    let currentY = tableStartY + headerHeight;
    datos.forEach((registro, rowIndex) => {
      let currentX = tableStartX;

      // Dibujar las celdas de la fila
      [
        registro.id,
        format(new Date(registro.timestamp), "yyyy-MM-dd HH:mm:ss"),
        registro.bus_dc_danfoss,
        registro.frec_salida_danfoss,
        registro.temperatura_vfd,
        registro.corriente,
        registro.voltage_motor,
        registro.potencia_hp,
        registro.potencia_kw,
        registro.ai,
        registro.av,
      ].forEach((value, colIndex) => {
        doc.fontSize(9).text(
          value.toString(),
          currentX + 5,
          currentY + 5,
          { width: columnWidths[colIndex] - 10, align: "center" }
        );
        currentX += columnWidths[colIndex];
      });

      // Dibujar borde de la fila
      doc.rect(
        tableStartX,
        currentY,
        columnWidths.reduce((a, b) => a + b, 0),
        rowHeight
      ).stroke();

      currentY += rowHeight; // Moverse a la siguiente fila

      // Crear nueva página si la tabla excede el límite
      if (currentY + rowHeight > 550) { // Ajustar el límite de la página
        doc.addPage();
        currentY = tableStartY;
      }
    });

    // Paginación
    doc.on("pageAdded", () => {
      doc.text(`Página ${doc.pageNumber}`, doc.page.width - 100, doc.page.height - 50, { align: "right" });
    });

    // Finalizar el documento
    doc.end();

    // Eventos del stream
    stream.on("finish", () => {
      resolve(pdfPath); // Retornar la ruta del archivo generado
    });

    stream.on("error", (error) => {
      reject(error); // Manejar errores del stream
    });
  });
}

module.exports = generarPDF;

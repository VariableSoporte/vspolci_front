"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { crearReporteServicios } from "../../../../../lib/reporte/aplicacion/reporteServicios";
import { ReporteInsumos } from "../../../../../lib/reporte/dominio";
import { MySQLReporteRepositorio } from "../../../../../lib/reporte/infraestructura/mySQLReporteRepositorio";
import "./ReporteInsumo.css";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../lib/usuario/dominio";
import { autoTable } from "jspdf-autotable";

export type ReporteInsumoProps = {
  titulo: string;
};

export const ReporteInsumo: React.FC<ReporteInsumoProps> = ({ titulo }) => {
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  let maximo = 3;
  const repositorio = MySQLReporteRepositorio();
  const serviciosReporte = crearReporteServicios(repositorio);
  const [datos, setDatos] = useState<ReporteInsumos[]>();

  const userState = useSelector((store: AppStore) => store.usuario);
  const datosFiltrados = (datos || [])
    .filter((item) => {
      const nombreMatch = item.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      if (filtroTipo === "top3") {
        maximo = 3;
        return true; // top3 se limita después
      } else if (filtroTipo == "top5") {
        maximo = 5;
        return true; // top3 se limita después
      } else if (filtroTipo == "top10") {
        maximo = 10;
        return true; // top3 se limita después
      } else if (filtroTipo === "constock") {
        return item.total > 0;
      }

      return nombreMatch;
    })
    .sort((a, b) => b.total - a.total);
  const datosFinales =
    filtroTipo !== "todos" ? datosFiltrados.slice(0, maximo) : datosFiltrados;

  useEffect(() => {
    fetchReportesInsumos();
  }, []);

  const fetchReportesInsumos = async () => {
    try {
      const respuesta = await serviciosReporte.reporteInsumos();
      setDatos(respuesta);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(
          "Error de formato en JSON reporte insumos:",
          error.message
        );
      } else {
        console.error("Error al guardar reporte insumos:", error);
      }
    }
  };

  const exportarPDF = async () => {
    const pdf = new jsPDF("portrait", "mm", "a4");

    const fechaActual = new Date().toLocaleDateString();
    const autor = userState.nombre + " " + userState.apellido;

    // ENCABEZADO
    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(18);
    pdf.text("Informe Generado por VSPOLCI", 105, 20, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(`${titulo}`, 10, 30, { align: "left" });
    pdf.setFontSize(14);
    pdf.text(`Fecha: ${fechaActual}`, 10, 38, { align: "left" });

    // GRAFICO (como imagen renderizada)
    const chartElement = document.getElementById("reporte-grafico");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 45, 190, 60);
    }

    let startY = 110;
    pdf.setFontSize(12);
    pdf.text("Detalle del reporte:", 14, startY);

    const listado_datos = datosFinales.map((item) => ({
      activo: item.activo,
      data: [
        item.nombre,
        item.total.toString(),
        item.descripcion,
        item.cantidad_paquete.toString(),
      ],
    }));
    autoTable(pdf, {
      head: [["Nombre", "Total", "Descripción", "Paquete"]],
      body: listado_datos.map((i) => i.data),
      startY: startY + 5,
      didParseCell: (data) => {
        const rowIndex = data.row.index;
        const rowData = listado_datos[rowIndex];

        if (rowData?.activo === 0 && data.section === "body") {
          data.cell.styles.fillColor = [255, 150, 150];
        }
      },
    });
    // FOOTER
    pdf.setFontSize(10);
    pdf.text(`Generado por: ${autor}`, 14, 285);

    pdf.save(`Reporte-${titulo}.pdf`);
  };
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="filtro-select-label">Filtrar por</InputLabel>
          <Select
            labelId="filtro-select-label"
            value={filtroTipo}
            label="Filtrar por"
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="top3">Top 3 </MenuItem>
            <MenuItem value="top5">Top 5 </MenuItem>
            <MenuItem value="top10">Top 10 </MenuItem>
            <MenuItem value="constock">Solo con stock</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Buscar producto"
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>
      <Box id="reporte-grafico">
        <Typography variant="h5">{titulo}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosFinales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>total</TableCell>
            <TableCell>Descripcion</TableCell>
            <TableCell>Paquete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datosFinales?.map((item, i) => (
            <TableRow key={i} className={!item.activo ? "inactive-row" : ""}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.total}</TableCell>
              <TableCell>{item.descripcion}</TableCell>
              <TableCell>{item.cantidad_paquete}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={exportarPDF} variant="contained" sx={{ mt: 2 }}>
        Descargar PDF
      </Button>
    </Box>
  );
};

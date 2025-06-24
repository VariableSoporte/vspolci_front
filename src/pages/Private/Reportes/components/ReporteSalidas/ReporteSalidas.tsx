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
import { autoTable } from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { ReporteSalidasReporte } from "../../../../../lib/reporte/dominio";
import { MySQLReporteRepositorio } from "../../../../../lib/reporte/infraestructura/mySQLReporteRepositorio";
import { AppStore } from "../../../../../lib/usuario/dominio";
import "./ReporteSalidas.css";

export type ReporteSalidasProps = {
  titulo: string;
};

type dataSolicitudes = {
  id_producto: number;
  nombre: string;
  cantidad: number;
};

export const ReporteSalidas: React.FC<ReporteSalidasProps> = ({ titulo }) => {
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState(new Date("01-01-2000"));
  const [fechaFin, setFechaFin] = useState(new Date("01-01-2050"));
  const repositorio = MySQLReporteRepositorio();
  const serviciosReporte = crearReporteServicios(repositorio);
  const [datos, setDatos] = useState<ReporteSalidasReporte[]>(); //tiene todos los datos del response
  const [listaData, setListaData] = useState<dataSolicitudes[]>([]);
  const userState = useSelector((store: AppStore) => store.usuario);

  useEffect(() => {
    fetchReportesInsumos();
  }, []);

  useEffect(() => {
    if (datos) {
      const filtrados = filtarDatosFecha(datos, fechaInicio, fechaFin);
      setListaData(returnListado(filtrados));
    }
  }, [fechaInicio, fechaFin, datos]);

  const fetchReportesInsumos = async () => {
    try {
      const respuesta = await serviciosReporte.reporteSolicitud();
      setDatos(filtarDatosFecha(respuesta, fechaInicio, fechaFin));
      console.log("res: ", respuesta);
      console.log(filtarDatosFecha(respuesta, fechaInicio, fechaFin));
      setListaData(
        returnListado(filtarDatosFecha(respuesta, fechaInicio, fechaFin))
      );
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

    const listado_datos = aplicarFiltroTop(listaData).map((item) => ({
      //activo: item.activo,
      data: [
        item.id_producto.toString(),
        item.nombre,
        item.cantidad.toString(),
      ],
    }));
    autoTable(pdf, {
      head: [["Id", "Nombre", "Cantidad"]],
      body: listado_datos.map((i) => i.data),
      startY: startY + 5,
    });

    // FOOTER
    pdf.setFontSize(10);
    pdf.text(`Generado por: ${autor}`, 14, 285);

    pdf.save(`Reporte-${titulo}.pdf`);
  };

  function formatearFecha(fechaString: string): string {
    // Asume formato dd-mm-yyyy
    console.log("filtrado en fechaString: ", fechaString);
    const [anio, mes, dia] = fechaString.split("-");
    console.log("filtrado en dia: ", dia.substring(0, 2));
    console.log("filtrado en mes: ", mes);
    console.log("filtrado en anio: ", anio);

    const fecha = new Date(`${anio}-${mes}-${dia}`); // ahora en formato ISO válido: yyyy-mm-dd

    console.log("filtrado en formatearFecha: ", fecha);

    const diaF = fecha.getUTCDate().toString().padStart(2, "0");
    const mesF = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
    const anioF = fecha.getUTCFullYear();

    console.log("dia: ", diaF);
    console.log("mes: ", mesF);
    console.log("año: ", anioF);

    return `${anioF}-${mesF}-${diaF}`;
  }

  const filtarDatosFecha = (
    datos_filtrar: ReporteSalidasReporte[],
    filtro_fecha_inicio: Date,
    filtro_fecha_fin: Date
  ): ReporteSalidasReporte[] => {
    const filtrados = datos_filtrar.filter((e) => {
      const fecha = new Date(e.fecha_salida);
      return fecha >= filtro_fecha_inicio && fecha <= filtro_fecha_fin;
    });

    if (filtrados.length === 0) {
      return [
        {
          id_producto: 0,
          nombre: "No hay registro",
          fecha_salida: "01-01-1900",
          cantidad: 0,
          id_salida: -1,
        },
      ];
    }

    return filtrados.map((e) => ({
      ...e,
      fecha_salida: formatearFecha(e.fecha_salida),
    }));
  };

  const returnListado = (
    listado_registros: ReporteSalidasReporte[]
  ): dataSolicitudes[] => {
    let listado: dataSolicitudes[] = [];
    listado_registros.map((d) => {
      if (!listado.some((p) => p.id_producto == d.id_producto)) {
        listado.push({
          id_producto: d.id_producto,
          nombre: d.nombre,
          cantidad: d.cantidad || 0,
        });
      } else {
        listado = listado.map((l) => {
          if (l.id_producto == d.id_producto) {
            return {
              ...l,
              cantidad: l.cantidad + d.cantidad || 0,
            };
          } else {
            return { ...l };
          }
        });
      }
    });
    return listado;
  };

  const aplicarFiltroTop = (datos: dataSolicitudes[]): dataSolicitudes[] => {
  const sorted = [...datos].sort((a, b) => b.cantidad - a.cantidad);

  switch (filtroTipo) {
    case "top3":
      return sorted.slice(0, 3);
    case "top5":
      return sorted.slice(0, 5);
    case "top10":
      return sorted.slice(0, 10);
    default:
      return sorted;
  }
};
  function formatDateSafe(fecha: Date): string {
    if (!fecha || isNaN(fecha.getTime())) return ""; // evita errores de fechas inválidas
    return fecha.toISOString().split("T")[0];
  }

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
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Fecha Inicio"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: "2000-01-01",
            max: "2100-12-31",
          }}
          value={formatDateSafe(fechaInicio)}
          onChange={(e) => {
            const nuevaFecha = new Date(e.target.value);
            if (!isNaN(nuevaFecha.getTime())) setFechaInicio(nuevaFecha);
          }}
        />
        <TextField
          type="date"
          label="Fecha Fin"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: "2000-01-01",
            max: "2100-12-31",
          }}
          value={formatDateSafe(fechaFin)}
          onChange={(e) => {
            const nuevaFecha = new Date(e.target.value);
            if (!isNaN(nuevaFecha.getTime())) setFechaFin(nuevaFecha);
          }}
        />
      </Box>
      <Box id="reporte-grafico">
        <Typography variant="h5">{titulo}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aplicarFiltroTop(listaData)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aplicarFiltroTop(listaData).map((item: any, i: any) => (
            <TableRow key={i}>
              <TableCell>{item.id_producto}</TableCell>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
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

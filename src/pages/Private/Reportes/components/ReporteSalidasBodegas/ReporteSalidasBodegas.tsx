"use client";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { crearReporteServicios } from "../../../../../lib/reporte/aplicacion/reporteServicios";
import { ReporteSalidasBodegasReporte } from "../../../../../lib/reporte/dominio";
import { MySQLReporteRepositorio } from "../../../../../lib/reporte/infraestructura/mySQLReporteRepositorio";
import { AppStore } from "../../../../../lib/usuario/dominio";
import "./ReporteSalidasBodegas.css";
import autoTable from "jspdf-autotable";

export type ReporteSalidasBodegasProps = {
  titulo: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

type dataSolicitudes = {
  id_bodega: number;
  nombre: string;
  ciudad: string;
  fecha_salida: string;
  cantidad: number;
};
type AgrupadoPorFecha = {
  fecha: string;
  [nombre_bodega: string]: number | string;
};
const coloresDisponibles = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
  "#d884d8",
  "#84d8b1",
  "#d89484",
];

export const ReporteSalidasBodegas: React.FC<ReporteSalidasBodegasProps> = ({
  titulo,
}) => {
  const [fechaInicio, setFechaInicio] = useState(new Date("01-01-2000"));
  const [fechaFin, setFechaFin] = useState(new Date("01-01-2050"));
  const repositorio = MySQLReporteRepositorio();
  const serviciosReporte = crearReporteServicios(repositorio);
  const userState = useSelector((store: AppStore) => store.usuario);
  const [datos, setDatos] = useState<ReporteSalidasBodegasReporte[]>(); //tiene todos los datos del response
  const [listaData, setListaData] = useState<dataSolicitudes[]>([]);

  //btn multi seleccion
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  // fin btn multi seleccion

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
      const respuesta = await serviciosReporte.reporteSalidasBodegas();
      setDatos(filtarDatosFecha(respuesta, fechaInicio, fechaFin));
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

  const filtarDatosFecha = (
    datos_filtrar: ReporteSalidasBodegasReporte[],
    filtro_fecha_inicio: Date,
    filtro_fecha_fin: Date
  ): ReporteSalidasBodegasReporte[] => {
    const filtrados = datos_filtrar.filter((e) => {
      const fecha = new Date(e.fecha_salida);
      console.log("fecha_filtrada: ", fecha);
      return fecha >= filtro_fecha_inicio && fecha <= filtro_fecha_fin;
    });

    if (filtrados.length === 0) {
      return [
        {
          id_bodega: 0,
          nombre: "No hay registro",
          fecha_salida: "01-01-1900",
          cantidad: 0,
          ciudad: "",
        },
      ];
    }

    return filtrados.map((e) => ({
      ...e,
      fecha_salida: formatearFecha(e.fecha_salida),
    }));
  };

  function formatearFecha(fechaString: string): string {
    const [anio, mes, dia] = fechaString.split("-");
    const fecha = new Date(`${anio}-${mes}-${dia}`); // ahora en formato ISO válido: yyyy-mm-dd
    const diaF = fecha.getUTCDate().toString().padStart(2, "0");
    const mesF = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
    const anioF = fecha.getUTCFullYear();
    return `${anioF}-${mesF}-${diaF}`;
  }

  const returnListado = (
    listado_registros: ReporteSalidasBodegasReporte[]
  ): dataSolicitudes[] => {
    let listado: dataSolicitudes[] = [];
    listado_registros.map((d) => {
      if (
        !listado.some(
          (p) => p.id_bodega == d.id_bodega && p.fecha_salida == d.fecha_salida
        )
      ) {
        listado.push({
          id_bodega: d.id_bodega,
          nombre: d.nombre,
          cantidad: d.cantidad || 0,
          ciudad: d.ciudad,
          fecha_salida: d.fecha_salida,
        });
      } else {
        listado = listado.map((l) => {
          if (l.id_bodega == d.id_bodega && l.fecha_salida == d.fecha_salida) {
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

  function agruparPorFechaYBodega(data: dataSolicitudes[]): AgrupadoPorFecha[] {
    const fechasUnicas = Array.from(
      new Set(data.map((e) => e.fecha_salida))
    ).sort();
    const bodegasUnicas = Array.from(new Set(data.map((e) => e.nombre)));

    // Inicializa un mapa por fecha con todas las bodegas en 0
    const resultado: AgrupadoPorFecha[] = fechasUnicas.map((fecha) => {
      const linea: AgrupadoPorFecha = { fecha };
      bodegasUnicas.forEach((bodega) => (linea[bodega] = 0));
      return linea;
    });

    // Rellenar con los valores reales
    data.forEach((registro) => {
      const linea = resultado.find((l) => l.fecha === registro.fecha_salida);
      if (linea) {
        linea[registro.nombre] =
          (linea[registro.nombre] as number) + registro.cantidad;
      }
    });

    return resultado;
  }

  function formatDateSafe(fecha: Date): string {
    if (!fecha || isNaN(fecha.getTime())) return ""; // evita errores de fechas inválidas
    return fecha.toISOString().split("T")[0];
  }

  function obtenerNombresUnicosDeBodegas(listado: dataSolicitudes[]): string[] {
    const nombresSet = new Set<string>();
    listado.forEach((item) => nombresSet.add(item.nombre));
    return Array.from(nombresSet);
  }

  function getColor(nombreBodega: string): string {
    // Usa un hash simple para asignar siempre el mismo color a la misma bodega
    const hash = [...nombreBodega].reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return coloresDisponibles[hash % coloresDisponibles.length];
  }
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

	let listado_datos=[];
    if (personName.length != 0) {
       listado_datos = personName.map((p) => {
        return listaData.map((item) => {
          if (p == item.nombre) {
            return {
              data: [
                item.id_bodega.toString(),
                item.nombre,
                item.ciudad,
                item.cantidad.toString(),
                item.fecha_salida,
              ],
            };
          }
		  
        });
      });
    } else {
       listado_datos = listaData.map((item) => {
        return {
          data: [
            item.id_bodega.toString(),
            item.nombre,
            item.ciudad,
            item.cantidad.toString(),
            item.fecha_salida,
          ],
        };

      });
    }

	//modificar listado permite filtros TODO
    autoTable(pdf, {
      head: [["Id", "Nombre", "Ciudad", "Cantidad", "Fecha"]],
      body: listado_datos.map((i:any) => i.data),
      startY: startY + 5,
    });

    // FOOTER
    pdf.setFontSize(10);
    pdf.text(`Generado por: ${autor}`, 14, 285);

    pdf.save(`Reporte-${titulo}.pdf`);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Bodegas</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {obtenerNombresUnicosDeBodegas(listaData).map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
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
          <LineChart data={agruparPorFechaYBodega(listaData)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            {obtenerNombresUnicosDeBodegas(listaData).map((bodega) => {
              if (personName.length == 0) {
                return (
                  <Line
                    key={bodega}
                    type="monotone"
                    dataKey={bodega}
                    stroke={getColor(bodega)}
                    dot={false}
                  />
                );
              } else {
                return personName.map((p) => {
                  if (p == bodega) {
                    return (
                      <Line
                        key={bodega}
                        type="monotone"
                        dataKey={bodega}
                        stroke={getColor(bodega)}
                        dot={false}
                      />
                    );
                  }
                });
              }
            })}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>ciudad</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listaData.map((item: any, i: any) => {
            if (personName.length == 0) {
              return (
                <TableRow key={i}>
                  <TableCell>{item.id_bodega}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.ciudad}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>{item.fecha_salida}</TableCell>
                </TableRow>
              );
            } else {
              return personName.map((p) => {
                if (p == item.nombre) {
                  return (
                    <TableRow key={i}>
                      <TableCell>{item.id_bodega}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.ciudad}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.fecha_salida}</TableCell>
                    </TableRow>
                  );
                }
              });
            }
          })}
        </TableBody>
      </Table>
      <Button onClick={exportarPDF} variant="contained" sx={{ mt: 2 }}>
        Descargar PDF
      </Button>
    </Box>
  );
};

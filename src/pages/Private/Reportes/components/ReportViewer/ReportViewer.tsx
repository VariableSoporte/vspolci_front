"use client";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import "./ReportViewer.css";

export type ReportViewerProps = {
  datos: any[];
  tipo: "linea" | "barra";
  titulo: string;
};

export const ReportViewer: React.FC<ReportViewerProps> = ({
  datos,
  tipo,
  titulo,
}) => {
  const exportarPDF = async () => {
    const input = document.getElementById("reporte-pdf");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 140);
    pdf.save(`${titulo}.pdf`);
  };
  return (
    <Box>
      <Box id="reporte-pdf">
        <Typography variant="h5">{titulo}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          {tipo === "linea" ? (
            <LineChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
            </LineChart>
          ) : (
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#82ca9d" />
            </BarChart>
          )}
        </ResponsiveContainer>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Button onClick={exportarPDF} variant="contained" sx={{ mt: 2 }}>
        Descargar PDF
      </Button>
    </Box>
  );
};

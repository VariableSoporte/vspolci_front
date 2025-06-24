"use client";
import InventoryIcon from '@mui/icons-material/Inventory';
import SendIcon from '@mui/icons-material/Send';
import StoreIcon from '@mui/icons-material/Store';
import { Grid2 } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { CardsReportes, ReporteInsumo, ReporteSalidas, ReporteSalidasBodegas } from "./components";
import "./Reportes.css";

export type ReportesProps = {
  // types...
};

export const Reportes: React.FC<ReportesProps> = ({}) => {
  //const listaOpciones = ["Insumo", "Salidas"];
  const [selectedView, setSelectedView] = useState("Insumo");
  const [value, setValue] = React.useState(0);

  const renderContent = () => {
    switch (selectedView) {
      case "Insumo":
        return <ReporteInsumo titulo="Reporte de Insumos" />;
      case "Salidas":
        return <ReporteSalidas titulo="Reporte de Solicitudes" />;
      case "Bodegas":
        return <ReporteSalidasBodegas titulo="Reporte de Rendimiento" />;
      default:
        return <>Sin seleccion de Reporte</>;
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container size={12} spacing={4}>
        <Grid2 container size={12}>
          <Grid2 size={{ xs: 6, md: 4, lg: 4 }}>
            <CardsReportes
              valor={5}
              titulo="Cantidad Usuarios"
              contenido="Total de usuarias activos"
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4, lg: 4 }}>
            <CardsReportes
              valor={3}
              titulo="Cantidad Bodegas"
              contenido="Total de bodegas activas"
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4, lg: 4 }}>
            <CardsReportes
              valor={120}
              titulo="Cantidad Movimientos"
              contenido="Total de movimientos"
            />
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12, lg: 12 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              setSelectedView(newValue);
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Insumo"
              value={"Insumo"}
              icon={<InventoryIcon />}
            />
            <BottomNavigationAction
              label="Salidas"
              value={"Salidas"}
              icon={<SendIcon />}
            />
            <BottomNavigationAction
              label="Bodegas"
              value={"Bodegas"}
              icon={<StoreIcon />}
            />
          </BottomNavigation>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12, lg: 12 }}>{renderContent()}</Grid2>
      </Grid2>
    </Box>
  );
};

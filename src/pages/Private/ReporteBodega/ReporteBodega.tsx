"use client";
//import FavoriteIcon from "@mui/icons-material/Favorite";
//import LocationOnIcon from "@mui/icons-material/LocationOn";
//import RestoreIcon from "@mui/icons-material/Restore";
import { Grid2 } from "@mui/material";
//import BottomNavigation from "@mui/material/BottomNavigation";
//import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import "./ReporteBodega.css";
import { CardsReportes } from "../Reportes/components";
import { ReporteEntregas } from "./ReporteEntregas";

export type ReporteBodegaProps = {
  // types...
};

export const ReporteBodega: React.FC<ReporteBodegaProps> = ({}) => {
  const [selectedView, _] = useState("Insumo");
  //const [value, setValue] = React.useState(0);

  const renderContent = () => {
    switch (selectedView) {
      case "Insumo":
        return <ReporteEntregas titulo="Entregas" />;
      case "Salidas":
        return <>salidas</>;
      case "Bodegas":
        return <>bodegas</>;
      default:
        return <>Sin seleccion de Reporte</>;
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container size={12} spacing={4}>
        <Grid2 container size={12}>
          <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
            <CardsReportes
              valor={20}
              titulo="Productos"
              contenido="Total de Insumos"
            />
          </Grid2>
          {/*
          <Grid2 size={{ xs: 6, md: 4, lg: 4 }}>
            <CardsReportes
              valor={450}
              titulo="Total Productos"
              contenido="Total de Inusmos existentes"
            />
          </Grid2>
          */}
          <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
            <CardsReportes
              valor={150}
              titulo="Cantidad Movimientos"
              contenido="Total de movimientos"
            />
          </Grid2>
        </Grid2>
        {/*
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
              icon={<RestoreIcon />}
            />
            <BottomNavigationAction
              label="Salidas"
              value={"Salidas"}
              icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
              label="Bodegas"
              value={"Bodegas"}
              icon={<LocationOnIcon />}
            />
          </BottomNavigation>
        </Grid2>
              */}
        <Grid2 size={{ xs: 12, md: 12, lg: 12 }}>{renderContent()}</Grid2>
      </Grid2>
    </Box>
  );
};

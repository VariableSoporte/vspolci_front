// Home.tsx
"use client";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BallotIcon from '@mui/icons-material/Ballot';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from '@mui/icons-material/Message';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BtnSalir } from "../../../components";
import { AppStore } from "../../../lib/usuario/dominio";
import { Keys } from "../../../models";
import { obtenerLocalStorage } from "../../../utilities";
import { EditarInsumoBodega } from "../EditarInsumoBodega";
import { Bodegas, Estados, Insumos, InventarioPage, Pedidos, Solicitudes, Usuarios } from "../index";
import { ReporteBodega } from "../ReporteBodega";
import { Reportes } from "../Reportes";
import { AppBar, Drawer, DrawerHeader } from "./HomeStyles"; // Importación de estilos


export type HomeProps = {};

export const Home: React.FC<HomeProps> = ({}) => {
  const userState = useSelector((store: AppStore) => store.usuario);

  const control_permiso = userState.permiso && obtenerLocalStorage(Keys.USUARIO).permiso; //0=user , 1=admin
  const lista_opciones = control_permiso ? ["Insumos", "Bodega", "Usuarios", "Reportes"] : ["Inventario","Solicitudes" , "Estados", "Pedidos", "Reporte Bodega", "Editar Insumo"];
  const lista_iconos = control_permiso ? [<BallotIcon />, <WarehouseIcon />, <AssignmentIndIcon />, <AssessmentIcon />] : [<InventoryIcon />, <MessageIcon />, <InfoIcon />, <AddShoppingCartIcon />, <AssessmentIcon />, <EditIcon />];
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(control_permiso?"Insumos":"Inventario");

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const renderContent = () => {
    switch (selectedView) {
      case "Insumos":
        return <Insumos />;
      case "Bodega":
        return <Bodegas />;
      case "Usuarios":
        return <Usuarios />;
      case "Inventario":
        return <InventarioPage />;
      case "Solicitudes":
        return <Solicitudes />;
      case "Estados":
        return <Estados />;
      case "Reportes":
        return <Reportes />;
      case "Reporte Bodega":
        return <ReporteBodega />;
      case "Editar Insumo":
        return <EditarInsumoBodega />;
      case "Pedidos":
        return <Pedidos />;
      default:
        return <Typography>Seleccione una opción</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, display: open ? "none" : "inline-flex" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            VSPOLCI    
          </Typography>
          <BtnSalir /> {/* Botón de salir en la barra superior a la derecha */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {lista_opciones.map(
            (text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => setSelectedView(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    { lista_iconos[index] }
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {renderContent()}
      </Box>
    </Box>
  );
};

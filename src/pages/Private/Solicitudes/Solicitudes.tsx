"use client";
import Alert from "@mui/material/Alert";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Fab from "@mui/material/Fab";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabla } from "../../../components";
import { crearInsumoServicios } from "../../../lib/insumo/aplicacion/insumoServicios";
import { Insumo } from "../../../lib/insumo/dominio";
import { MySQLInsumoRepositorio } from "../../../lib/insumo/infraestructura/mySQLInsumoRepositorio";
import { crearInventarioServicios } from "../../../lib/inventario/aplicacion/inventarioServicios";
import {
  Inventario,
  InventarioSolicitud,
  InventarioSolicitudVacio,
} from "../../../lib/inventario/dominio";
import { MySQLInventarioRepositorio } from "../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { AppStore } from "../../../lib/usuario/dominio";
import { COLUMNAS_SOLICITUD } from "../../../models";
import "./Solicitudes.css";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ModalSolicitudes } from "./ModalSolicitudes";
import { ListadoPedidos } from "./ListadoPedidos";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -20px;
    right: -60px;
    width: 25px;
    height: 25px;
  }
`;

export type SolicitudesProps = {
  // types...
};

export const Solicitudes: React.FC<SolicitudesProps> = ({}) => {
  const userState = useSelector((store: AppStore) => store.usuario);
  const repositorioInv = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorioInv);
  const repositorio = MySQLInsumoRepositorio();
  const serviciosInsumo = crearInsumoServicios(repositorio);
  const [rowsInsumos, setRowsInsumos] = useState<Insumo[]>([]);
  const [rowsInventario, setRowsInventario] = useState<Inventario[]>([]);
  const [pedido, setPedido] = useState<InventarioSolicitud>(
    InventarioSolicitudVacio
  );
  const [selectedRow, setSelectedRow] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const showAlert = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setTimeout(() => setAlertMessage(null), 3000); // Oculta la alerta después de 3 segundos
  };

  const fetchInsumos = async () => {
    try {
      const result = await serviciosInsumo.traerTodo();
      setRowsInsumos(result);
      const results = await serviciosInventario.traerTodo(userState.id_bodega);
      setRowsInventario(results);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };
  const handleRowSelect = (row: Insumo) => {
    if (!row.activo) {
      showAlert("El insumo no esta activo", "warning");
      return;
    }
    setSelectedRow(row);
    setIsModalOpen(true);
    console.log("fila seleccionada: ", row);
    console.log("inventario: ", rowsInventario);
    console.log("insumo: ", rowsInsumos);
    console.log("usuarios: ", userState);

  };

  const insumosConCantidad = rowsInsumos.map((insumo) => {
    const inventarioRelacionado = rowsInventario.find(
      (inv) => inv.id_producto_per === insumo.id
    );

    return {
      ...insumo,
      cantidad: inventarioRelacionado ? inventarioRelacionado.cantidad : 0,
    };
  });

  // Orden: primero con stock, luego sin, ordenados de menor a mayor
  const insumosOrdenados = insumosConCantidad.sort((a, b) => {
    if (a.cantidad === 0 && b.cantidad > 0) return 1;
    if (a.cantidad > 0 && b.cantidad === 0) return -1;
    return a.cantidad - b.cantidad;
  });

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSelectedRow({}); // Limpiar la fila seleccionada
  };
  return (
    <div className="solicitudes">
      {alertMessage && (
        <Alert
          variant="filled"
          severity={alertSeverity}
          sx={{ marginBottom: "16px" }}
        >
          {alertMessage}
        </Alert>
      )}
      <Tabla
        columnas={COLUMNAS_SOLICITUD}
        filas={insumosOrdenados}
        onRowSelect={handleRowSelect}
      />
      <Fab sx={fabStyle} variant="extended" onClick={() => setDialogOpen(true)}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <CartBadge
          badgeContent={pedido.pedido.length}
          color="primary"
          overlap="circular"
        />
        Pedido
      </Fab>
      <ListadoPedidos
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        pedido={pedido.pedido}
        actualizarPedido={(nuevoListado) =>
          setPedido((prev) => ({ ...prev, pedido: nuevoListado }))
        }
		alerta={showAlert}
		data_solicitud={pedido}
      />
      {selectedRow && (
        <ModalSolicitudes
          row={selectedRow}
          open={isModalOpen}
          onClose={handleModalClose}
          actualizar={setPedido}
          dataPedido={pedido}
          alerta={showAlert}
        />
      )}
    </div>
  );
};

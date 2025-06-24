"use client";
import React, { useEffect, useState } from "react";
import "./Inventario.css";
import { Tabla } from "../../../components";
import { COLUMNAS_INVENTARIO } from "../../../models/tablas";
import { Inventario } from "../../../lib/inventario/dominio";
import { MySQLInventarioRepositorio } from "../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { crearInventarioServicios } from "../../../lib/inventario/aplicacion/inventarioServicios";
import { useSelector } from "react-redux";
import { AppStore } from "../../../lib/usuario/dominio";
import Alert from "@mui/material/Alert";
import { ModalInventario } from "./ModalInventario";

export type InventarioProps = {
  // types...
};

export const InventarioPage: React.FC<InventarioProps> = ({}) => {
  const userState = useSelector((store: AppStore) => store.usuario);
  const repositorio = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorio);
  const [rowsInventario, setRowsInventario] = useState<Inventario[]>([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const fetchInventario = async () => {
    try {
      const result = await serviciosInventario.traerTodo(userState.id_bodega);
      setRowsInventario(result);
      console.log(rowsInventario);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };
  // Función para manejar la fila seleccionada
    const handleRowSelect = (row: any) => {
      console.log(row);
      setSelectedRow(row);
      setIsModalOpen(true);
      /*
      const { activo, ...rowWithoutActivo } = row;
      setFilasFiltradas(rowWithoutActivo);
      setSelectedRow(row);
      console.log("Fila seleccionada:", row);
      setIsModalOpen(true);
      */
    };
  

  useEffect(() => {

    fetchInventario();

  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSelectedRow({}); // Limpiar la fila seleccionada
  };

  return (
    <div className="inventario">
      {/* Mostrar alerta si hay un mensaje */}
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
        columnas={COLUMNAS_INVENTARIO}
        filas={rowsInventario}
        onRowSelect={handleRowSelect}
      />
      {selectedRow && (
      <ModalInventario row={selectedRow} open={isModalOpen} onClose={handleModalClose} actualizar={setRowsInventario} alerta={showAlert} />
      )}
    </div>
  );
};

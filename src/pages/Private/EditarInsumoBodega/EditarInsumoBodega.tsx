"use client";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabla } from "../../../components";
import { crearInsumoServicios } from "../../../lib/insumo/aplicacion/insumoServicios";
import { InsumoKardex } from "../../../lib/insumo/dominio";
import { MySQLInsumoRepositorio } from "../../../lib/insumo/infraestructura/mySQLInsumoRepositorio";
import { AppStore } from "../../../lib/usuario/dominio";
import { COLUMNAS_INSUMOS_BODEGAS } from "../../../models";
import "./EditarInsumoBodega.css";
import { ModalEditarInsumoBodega } from "./ModalEditarInsumoBodega";

export type EditarInsumoBodegaProps = {
  // types...
};

const EditarInsumoBodega: React.FC<EditarInsumoBodegaProps> = ({}) => {
  const repositorio = MySQLInsumoRepositorio();
  const serviciosInsumo = crearInsumoServicios(repositorio);
  const userState = useSelector((store: AppStore) => store.usuario);
  const [rowsInsumosBodega, setRowsInsumosBodega] = useState<InsumoKardex[]>([]);
  const [selectedRow, setSelectedRow] = useState<InsumoKardex | null>(null);
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
  const fetchInsumos = async () => {
    try {
      const result = await serviciosInsumo.traerPorBodega(userState.id_bodega);
      setRowsInsumosBodega(result);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };

  const fetchGuardar = async (id_kardex:number, estante:string, fila:number) => {
    try {
      await serviciosInsumo.actualizarKardex(id_kardex,estante,fila);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        console.error("Error al guardar:", error);
      }
    }
  };

  const onDelete = async () => {
    try {
      alert("no puedes eliminar con este nivel")
      //await serviciosInsumo.eliminar(id);
      showAlert("Insumo eliminada correctamente.", "success");
      return true;
    } catch (error) {
      showAlert("No se puede eliminar insumo en uso", "warning");
      return false;
    }
  };

  // Función para manejar la fila seleccionada
  const handleRowSelect = (row: InsumoKardex) => {
    setSelectedRow(row);
    console.log("Fila seleccionada:", row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSelectedRow(null); // Limpiar la fila seleccionada
  };

  useEffect(() => {
    fetchInsumos();
  }, []);
  return (
    <>
      <div className="contenido">
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
          columnas={COLUMNAS_INSUMOS_BODEGAS}
          filas={rowsInsumosBodega}
          onRowSelect={handleRowSelect}
        />
      </div>
      {selectedRow && (
        <ModalEditarInsumoBodega
          open={isModalOpen}
          onClose={handleModalClose}
          row={selectedRow} // Pasar los datos de la fila al modal
          text="EDITAR INSUMO"
          deshabilitado={["id_kardex","id_producto_per","nombre","descripcion","categoria","cantidad"]}
          handleFunction={fetchGuardar}
          actualizar={setRowsInsumosBodega}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default EditarInsumoBodega;

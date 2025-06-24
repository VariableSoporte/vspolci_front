"use client";
import React, { useEffect, useState } from "react";
import "./Insumos.css";
import { MySQLInsumoRepositorio } from "../../../lib/insumo/infraestructura/mySQLInsumoRepositorio";
import { crearInsumoServicios } from "../../../lib/insumo/aplicacion/insumoServicios";
import { Insumo } from "../../../lib/insumo/dominio";
import { BtnNuevo, ModalData, Tabla } from "../../../components";
import { COLUMNAS_INSUMOS, COLUMNAS_INSUMOS_CREAR } from "../../../models";
import Alert from "@mui/material/Alert";

export type InsumosProps = {
  // types...
};

export const Insumos: React.FC<InsumosProps> = ({}) => {
  const repositorio = MySQLInsumoRepositorio();
  const serviciosInsumo = crearInsumoServicios(repositorio);
  const [rowsInsumos, setRowsInsumos] = useState<Insumo[]>([]);
  const [filaFiltradas, setFilasFiltradas] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<Insumo | null>(null);
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
      const result = await serviciosInsumo.traerTodo();
      setRowsInsumos(result);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };

  const fetchGuardar = async (actualizado: Insumo) => {
    try {
      await serviciosInsumo.editar(actualizado);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        console.error("Error al guardar:", error);
      }
    }
  };

  const onDelete = async (id: number) => {
    try {
      await serviciosInsumo.eliminar(id);
      showAlert("Insumo eliminada correctamente.", "success");
      return true;
    } catch (error) {
      showAlert("No se puede eliminar insumo en uso", "warning")
        return false;
    }
  };

  const onCreate = async (insumo: Insumo) => {
    try {
      await serviciosInsumo.crear(insumo);
      await fetchInsumos();
      showAlert("Se creó el insumo correctamente.", "success");
    } catch (error) {
      showAlert("Hubo un error al crear el insumo.", "error");
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        console.error("Error al crear:", error);
      }
    }
  };

  // Función para manejar la fila seleccionada
  const handleRowSelect = (row: Insumo) => {
    const { activo, ...rowWithoutActivo } = row;
    setFilasFiltradas(rowWithoutActivo);
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
          columnas={COLUMNAS_INSUMOS}
          filas={rowsInsumos}
          onRowSelect={handleRowSelect}
        />
        <BtnNuevo
          text="Crear"
          fields={COLUMNAS_INSUMOS_CREAR}
          onCreate={onCreate}
        />
      </div>
      {selectedRow && (
        <ModalData
          open={isModalOpen}
          onClose={handleModalClose}
          row={filaFiltradas} // Pasar los datos de la fila al modal
          text="EDITAR INSUMO"
          deshabilitado={["id"]}
          handleFunction={fetchGuardar}
          actualizar={setRowsInsumos}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Insumos;

"use client";
import React, { useEffect, useState } from 'react';
import './Bodegas.css';
import { Bodega } from '../../../lib/bodega/dominio';
import { crearBodegaServicios } from '../../../lib/bodega/aplicacion/bodegaServicios';
import { MySQLBodegaRepositorio } from '../../../lib/bodega/infraestructura/mySQLBodegaRepositorio';
import Alert from "@mui/material/Alert";
import { BtnNuevo, ModalData, Tabla } from "../../../components";
import { COLUMNAS_BODEGAS, COLUMNAS_BODEGAS_CREAR } from '../../../models/tablas';

export type BodegasProps = {
	// types...
}

export const Bodegas: React.FC<BodegasProps>  = ({}) => {

	const repositorio = MySQLBodegaRepositorio();
  const servicioBodega = crearBodegaServicios(repositorio);
  const [rowsInsumos, setRowsInsumos] = useState<Bodega[]>([]);
  const [filaFiltradas, setFilasFiltradas] = useState<any>([]);
  const [selectedRow, setSelectedRow] = useState<Bodega | null>(null);
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
      const result = await servicioBodega.traerTodo();
      setRowsInsumos(result);
    } catch (error) {
      console.error("Error fetching bodega:", error);
    }
  };

  const fetchGuardar = async (actualizado: Bodega) => {
    try {
      await servicioBodega.editar(actualizado);
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
      await servicioBodega.eliminar(id);
      showAlert("Bodega eliminada correctamente.", "success");
      return true;
    } catch (error) {
      
        showAlert("No se puede eliminar bodegas en uso", "warning")
        return false;
    }
  };

  const onCreate = async (insumo: Bodega) => {
    try {
      await servicioBodega.crear(insumo);
      await fetchInsumos();
      showAlert("Se creó la bodega correctamente.", "success");
    } catch (error) {
      showAlert("Hubo un error al crear la bodega.", "error");
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        console.error("Error al crear:", error);
      }
    }
  };

  // Función para manejar la fila seleccionada
  const handleRowSelect = (row: Bodega) => {
    const { ...rowWithoutActivo } = row;
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
          columnas={COLUMNAS_BODEGAS}
          filas={rowsInsumos}
          onRowSelect={handleRowSelect}
        />
        <BtnNuevo
          text="Crear"
          fields={COLUMNAS_BODEGAS_CREAR}
          onCreate={onCreate}
        />
      </div>
      {selectedRow && (
        <ModalData
          open={isModalOpen}
          onClose={handleModalClose}
          row={filaFiltradas} // Pasar los datos de la fila al modal
          text="EDITAR BODEGA"
          deshabilitado={["id"]}
          handleFunction={fetchGuardar}
          actualizar={setRowsInsumos}
          onDelete={onDelete}
        />
      )}
    </>
	);
};

export default Bodegas;

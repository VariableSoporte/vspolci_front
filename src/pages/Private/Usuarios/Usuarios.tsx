"use client";
import React, { useEffect, useState } from 'react';
import './Usuarios.css';
import { MySQLUsuarioRepositorio } from '../../../lib/usuario/infraestructura/mySQLUsuarioRepositorio';
import { crearUsuarioServicios } from '../../../lib/usuario/aplicacion/usuarioServicios';
import { Usuario } from '../../../lib/usuario/dominio';
import Alert from "@mui/material/Alert";
import { COLUMNAS_USUARIOS } from '../../../models/tablas';
import { MySQLBodegaRepositorio } from '../../../lib/bodega/infraestructura/mySQLBodegaRepositorio';
import { crearBodegaServicios } from '../../../lib/bodega/aplicacion/bodegaServicios';
import { Bodega } from '../../../lib/bodega/dominio';
import { TablaUsuarios, ModalUsuarios, BtnCrearUsuario } from './index';

export type UsuariosProps = {
	// types...
}

export const Usuarios: React.FC<UsuariosProps>  = ({}) => {
  const repo = MySQLBodegaRepositorio();
  const serviciosBodega = crearBodegaServicios(repo);
	const repositorio = MySQLUsuarioRepositorio();
  const serviciosUsuario = crearUsuarioServicios(repositorio);
  const [listaBodegas, setListaBodegas] = useState<Bodega[]>([]);
  const [rowsUsuarios, setRowsUsuarios] = useState<Usuario[]>([]);
  const [selectedRow, setSelectedRow] = useState<Usuario | null>(null);
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
  const fetchUsuarios = async () => {
    try {
      const result = await serviciosUsuario.traerTodo();
      setRowsUsuarios(result);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };
  const fetchBodegas = async () => {
    try {
      const result = await serviciosBodega.traerTodo();
      setListaBodegas(result);
    } catch (error) {
      console.error("Error fetching bodegas:", error);
    }
  };

  const fetchGuardar = async (actualizado: Usuario) => {
    try {
      await serviciosUsuario.editar(actualizado);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        showAlert("Error al editar el usuario", "error")
        console.error("Error al guardar:", error);
      }
    }
  };

  const onDelete = async (id: number) => {
    try {
      await serviciosUsuario.eliminar(id);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON:", error.message);
      } else {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const onCreate = async (usuario: Usuario) => {
    try {
      await serviciosUsuario.crear(usuario);
      await fetchUsuarios();
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
  const handleRowSelect = (row: Usuario) => {
    setSelectedRow(row);
    console.log("Fila seleccionada:", row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSelectedRow(null); // Limpiar la fila seleccionada
  };

  useEffect(() => {
    fetchUsuarios();
    fetchBodegas();
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
        <TablaUsuarios
          columnas={COLUMNAS_USUARIOS}
          filas={rowsUsuarios}
          onRowSelect={handleRowSelect}
        />

        <BtnCrearUsuario text='Crear Usuario' onCreate={onCreate} listaBodegas={listaBodegas} />
      </div>
      {selectedRow && (
        <ModalUsuarios
          open={isModalOpen}
          onClose={handleModalClose}
          row={selectedRow} // Pasar los datos de la fila al modal
          text="EDITAR USUARIO"
          handleFunction={fetchGuardar}
          actualizar={setRowsUsuarios}
          onDelete={onDelete}
          listaBodegas={listaBodegas}
        />
      )}
    </>
	);
};


"use client";
import React, { useEffect, useState } from "react";
import "./Estados.css";
import { COLUMNAS_INVENTARIO_ESTADO } from "../../../models";
import { Tabla } from "../../../components";
import {
  EstadosPedidos,
  EstadosPedidosVacio,
  ListaPedido,
} from "../../../lib/inventario/dominio";
import { MySQLInventarioRepositorio } from "../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { crearInventarioServicios } from "../../../lib/inventario/aplicacion/inventarioServicios";
import { useSelector } from "react-redux";
import { AppStore } from "../../../lib/usuario/dominio";
import { ModalEstados } from "./ModalEstados";

export type EstadosProps = {
  // types...
};
const formatearFecha = (fechaString: string) => {
  if (!fechaString) return "—";
  const fecha = new Date(fechaString);
  return fecha.toISOString().split("T")[0]; // yyyy-mm-dd
};

export const Estados: React.FC<EstadosProps> = ({}) => {
  const userState = useSelector((store: AppStore) => store.usuario);
  const [solicitud, setSolicitud] = useState<ListaPedido[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState<EstadosPedidos[]>([
    EstadosPedidosVacio,
  ]);
  const repositorioInv = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorioInv);

  useEffect(() => {
    fetchEstadosInventario();
  }, []);

  const fetchEstadosInventario = async () => {
    try {
      const result = await serviciosInventario.estadosSolicitud(
        userState.id_bodega
      );
      const resultFormato = result.map((e) => {
        return {
          ...e,
          fecha_aprobado: formatearFecha(e.fecha_aprobado),
          fecha_emision: formatearFecha(e.fecha_emision),
		  activo: e.usuario_aprobador ? 1 :0
        };
      });
      setSolicitudes(resultFormato);
    } catch (error) {
      console.error("Error al consultar solicitudes:", error);
    }
  };

  const handleRowSelected = (row: EstadosPedidos) => {
	console.log(row);
    setSolicitud(row.productos);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSolicitud([]); // Limpiar la fila seleccionada
  };
  return (
    <div className="estados">
      <Tabla
        columnas={COLUMNAS_INVENTARIO_ESTADO}
        filas={solicitudes}
        onRowSelect={handleRowSelected}
      />
      {solicitud && <ModalEstados row={solicitud} open={isModalOpen} onClose={handleModalClose}  />}
    </div>
  );
};

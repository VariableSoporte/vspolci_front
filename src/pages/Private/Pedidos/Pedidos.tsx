"use client";
import React, { useEffect, useState } from "react";
import "./Pedidos.css";
import { Tabla } from "../../../components";
import { COLUMNAS_INVENTARIO_ESTADO } from "../../../models";
import { ModalPedidos } from "./ModalPedidos";
import {
  EstadosPedidos,
  EstadosPedidosVacio,
  ListaPedido,
} from "../../../lib/inventario/dominio";
import { useSelector } from "react-redux";
import { AppStore } from "../../../lib/usuario/dominio";
import { MySQLInventarioRepositorio } from "../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { crearInventarioServicios } from "../../../lib/inventario/aplicacion/inventarioServicios";

export type PedidosProps = {
  // types...
};
const formatearFecha = (fechaString: string) => {
  if (!fechaString) return "—";
  const fecha = new Date(fechaString);
  return fecha.toISOString().split("T")[0]; // yyyy-mm-dd
};

export const Pedidos: React.FC<PedidosProps> = ({}) => {
  const userState = useSelector((store: AppStore) => store.usuario);
  const [solicitud, setSolicitud] = useState<ListaPedido[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState<EstadosPedidos[]>([
    EstadosPedidosVacio,
  ]);
  const [fila, setFila] =
    useState<EstadosPedidos>(EstadosPedidosVacio);
  const repositorioInv = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorioInv);

  useEffect(() => {
    fetchEstadosInventario();
  }, []);

  const fetchEstadosInventario = async () => {
    try {
      const result = await serviciosInventario.estadosPedido(
        userState.id_bodega
      );
      const resultFormato = result.map((e) => {
        return {
          ...e,
          fecha_aprobado: formatearFecha(e.fecha_aprobado),
          fecha_emision: formatearFecha(e.fecha_emision),
          activo: e.usuario_aprobador ? 1 : 0,
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
    setFila(row);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    setSolicitud([]); // Limpiar la fila seleccionada
  };
  return (
    <div>
      <Tabla
        columnas={COLUMNAS_INVENTARIO_ESTADO}
        filas={solicitudes}
        onRowSelect={handleRowSelected}
      />
      {solicitud && (
        <ModalPedidos
          row={solicitud}
          setRow={(val:ListaPedido[])=>setSolicitud(val)}
          open={isModalOpen}
          onClose={handleModalClose}
          data={fila}
        />
      )}
    </div>
  );
};

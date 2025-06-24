import { CONEXION, CONEXION_INVENTARIO } from "../../shared/conexiones";
import {
  EstadosPedidos,
  Inventario,
  InventarioEntregaInsumo,
  InventarioRepositorio,
  InventarioSolicitud,
} from "../dominio";

export const MySQLInventarioRepositorio = (): InventarioRepositorio => ({
  traerTodo: async (id_bodega: number) => {
    try {
      const response = await fetch(`${CONEXION.INVENTARIO_URL}${id_bodega}`);
      if (!response.ok) {
        throw new Error("Error al obtener inventario");
      }
      const inventario = (await response.json()) as Inventario[];
      return inventario;
    } catch (error) {
      console.error("Error en traerTodo Inventario:", error);
      throw error;
    }
  },
  entregarInsumo: async (entregarInsumo: InventarioEntregaInsumo) => {
    try {
      const response = await fetch(
        `${CONEXION_INVENTARIO.INVENTARIO_CONEXION_ENTREGA}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_kardex_per: entregarInsumo.id_kardex,
            numero_informe: entregarInsumo.numero_informe,
            cantidad: entregarInsumo.cantidad,
            nombre_solicitante: entregarInsumo.nombre_solicitante,
            area: entregarInsumo.area,
            disposicion_entrega: entregarInsumo.disposicion_entrega,
          }),
        }
      );
      console.log("antes del response.ok");
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error en el entrega insumo";
        if (response.status === 401) {
          errorMessage =
            errorData.message || "Error al guardar cambios del inventario";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Inventario presenta errores";
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("Error en Inventario:", error);
      throw error;
    }
  },
  solicitarInsumo: async (solicitud: InventarioSolicitud) => {
    try {
      const response = await fetch(
        `${CONEXION_INVENTARIO.INVENTARIO_CONEXION_SOLICITUD}`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            id_bodega_per: solicitud.id_bodega_per,
            id_bodega_sol: solicitud.id_bodega_sol,
            fecha_emision: solicitud.fecha_emision,
            id_usuario_sol: solicitud.id_usuario_sol,
            pedido: solicitud.pedido,
          }),
        }
      );

      console.log("antes del response.ok");
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error en la solicitud";
        if (response.status === 401) {
          errorMessage = errorData.message || "Error al guardar solicitud";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Solicitud presenta errores";
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("Error en Solicitud:", error);
      throw error;
    }
  },
  estadoSolicitud: async (id_bodega: number) => {
    try {
      const response = await fetch(
        `${CONEXION_INVENTARIO.INVENTARIO_CONEXION_ESTADO}${id_bodega}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener estados solicitudes");
      }
      const estados = (await response.json()) as EstadosPedidos[];
      return estados;
    } catch (error) {
      console.error("Error en estado soliciutd Inventario:", error);
      throw error;
    }
  },
  estadoPedido: async (id_bodega: number) => {
    try {
      const response = await fetch(
        `${CONEXION_INVENTARIO.INVENTARIO_CONEXION_PEDIDO}${id_bodega}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener estados pedidos");
      }
      const estados = (await response.json()) as EstadosPedidos[];
      return estados;
    } catch (error) {
      console.error("Error en estado pedido Inventario:", error);
      throw error;
    }
  },
  aprobarSolicitudYGenerarMovimientos: async (
    id_solicitud,
    id_usuario_aprueba,
    productos_aprobados
  ) => {
    try {
      const response = await fetch(
        `${CONEXION_INVENTARIO.INVENTARIO_CONEXION_APROBAR_SOLICITUD}`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            id_solicitud: id_solicitud,
            id_usuario_aprueba: id_usuario_aprueba,
            productos_aprobados: productos_aprobados,
          }),
        }
      );

      console.log("antes del response.ok");
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error en la aprobar solicitud";
        if (response.status === 401) {
          errorMessage = errorData.message || "Error al probar solicitud";
        } else if (response.status === 404) {
          errorMessage =
            errorData.message || "aprobar solicitud presenta errores";
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("Error en aprobar solicitud:", error);
      throw error;
    }
  },
});

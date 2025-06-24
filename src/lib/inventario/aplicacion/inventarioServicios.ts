import {
  InventarioEntregaInsumo,
  InventarioRepositorio,
  InventarioSolicitud,
} from "../dominio";

export const crearInventarioServicios = (
  repositorio: InventarioRepositorio
) => ({
  traerTodo: async (id_bodega: number) =>
    await repositorio.traerTodo(id_bodega),
  entregarInsumo: async (entrega: InventarioEntregaInsumo) =>
    await repositorio.entregarInsumo(entrega),
  solicitarInsumo: async (solicitud: InventarioSolicitud) =>
    await repositorio.solicitarInsumo(solicitud),
  estadosSolicitud: async (id_bodega: number) =>
    await repositorio.estadoSolicitud(id_bodega),
  estadosPedido: async (id_bodega: number) =>
    await repositorio.estadoPedido(id_bodega),
  aprobarSolicitudYGenerarMovimientos: async (
    id_solicitud: number,
    id_usuario_aprueba: number,
    productos_aprobados: {
      id_detalle_solicitud: number;
      cantidad_a_enviar: number;
      id_kardex_per: number;
      id_producto_per: number;
    }[]
  ) => await repositorio.aprobarSolicitudYGenerarMovimientos(id_solicitud,id_usuario_aprueba, productos_aprobados),
  /*traerPorId: async (id:number) => await repositorio.traerPorId(id),
    crear: async (insumo: Inventario) => await repositorio.crear(insumo),
    editar: async (insumo: Inventario) => await repositorio.editar(insumo),
    eliminar: async (id: number) => await repositorio.eliminar(id)*/
});

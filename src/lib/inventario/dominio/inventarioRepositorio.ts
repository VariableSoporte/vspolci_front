import {
  EstadosPedidos,
  Inventario,
  InventarioEntregaInsumo,
  InventarioSolicitud,
} from "./inventario";

export interface InventarioRepositorio {
  traerTodo(id_bodega: number): Promise<Inventario[]>;
  entregarInsumo(entrega: InventarioEntregaInsumo): void;
  solicitarInsumo(solicitud: InventarioSolicitud): void;
  estadoSolicitud(id_bodega: number): Promise<EstadosPedidos[]>;
  estadoPedido(id_bodega: number): Promise<EstadosPedidos[]>;
  aprobarSolicitudYGenerarMovimientos(
    id_solicitud: number,
    id_usuario_aprueba: number,
    productos_aprobados: {
      id_detalle_solicitud: number;
      cantidad_a_enviar: number;
      id_kardex_per: number;
      id_producto_per: number;
    }[]
  ): Promise<void>;
  /*traerPorId(id:number): Promise<Inventario | null>;
    editar(insumo: Inventario): Promise<void>;
    crear(insumo: Inventario): Promise<void>;
    eliminar(id: number): Promise<void>;*/
}

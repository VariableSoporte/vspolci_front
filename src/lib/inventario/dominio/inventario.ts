export interface Inventario {
  id_kardex: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidad_paquete: number;
  nombre_medida: string;
  categoria: string;
  codigo: string;
  estante: string;
  fila: number;
  id_producto_per: number;
}

export type dato = {
  id_producto_per: number;
  nombre_producto: string;
  cantidad: number;
  motivo: string;
  detalle_solicitud: string;
  cantidad_enviada: number;
};

export interface InventarioSolicitud {
  //listado de elementos de la solicitud
  id_bodega_per: number;
  id_bodega_sol: number;
  fecha_emision: string;
  fecha_aprobado: string;
  aprovado: number;
  id_usuario_sol: number;
  id_usuario_aprueba: number;
  pedido: dato[];
}

export interface InventarioEntregaInsumo {
  id_kardex: number;
  numero_informe: string;
  cantidad: number;
  nombre_solicitante: string;
  area: string;
  disposicion_entrega: string;
}


export type ListaPedido = {
  id_producto_per: number;
  nombre_producto: string;
  cantidad: number;
  cantidad_enviada: number;
  id_kardex?:number;
  id_detalle_solicitud?:number;
};

export interface EstadosPedidos {
  id_solicitud: number;
  nombre_bodega: string;
  fecha_emision: string;
  fecha_aprobado: string;
  usuario_solicitante: string;
  usuario_aprobador: string;
  productos: ListaPedido[];
}

export const EstadosPedidosVacio: EstadosPedidos = {
  id_solicitud: 0,
  nombre_bodega: '',
  fecha_aprobado: '',
  fecha_emision: '',
  usuario_solicitante: '',
  usuario_aprobador: '',
  productos:[]
}

export const InventarioEntregaInsumoVacio: InventarioEntregaInsumo = {
  id_kardex: 0,
  numero_informe: "",
  cantidad: 0,
  nombre_solicitante: "",
  area: "",
  disposicion_entrega: "",
};

export const InventarioVacio: Inventario = {
  id_kardex: 0,
  nombre: "",
  descripcion: "",
  cantidad: 0,
  cantidad_paquete: 0,
  nombre_medida: "",
  categoria: "",
  codigo: "",
  estante: "",
  fila: 0,
  id_producto_per: 0,
};

export const InventarioSolicitudVacio: InventarioSolicitud = {
  id_bodega_per: 0,
  id_bodega_sol: 0,
  fecha_emision: "1900-01-01",
  fecha_aprobado: "1900-01-01",
  aprovado: 0,
  id_usuario_sol: 0,
  id_usuario_aprueba: 0,
  pedido: [],
};

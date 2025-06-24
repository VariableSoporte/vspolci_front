import { GridColDef } from "@mui/x-data-grid";


export type filaInventario = {
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
};

export const COLUMNAS_INVENTARIO: GridColDef[] = [
  { field: "id_kardex", headerName: "ID" },
  { field: "nombre",headerName: "Nombre", width: 130, renderCell: (params) => (
      <span title={params.row.descripcion}>{params.value}</span>
    ), },
  { field: "cantidad", headerName: "Cantidad", type: "number", width: 130 },
  { field: "cantidad_paquete", headerName: "Unidad paquete", type: "number", width: 130 },
  { field: "nombre_medida", headerName: "Medida", type: "number", width: 130 },
  { field: "categoria", headerName: "Categoria", type: "number", width: 130 },
  { field: "codigo", headerName: "Codigo", type: "number", width: 130 },
  { field: "lugar", headerName: "Ubicacion", description: "Lugar donde esta el insumo",width:130, valueGetter: (_, row) => `${row.estante || ""} ${row.fila || ""}`
  }
];

export const COLUMNAS_INVENTARIO_ENTREGA = [
  { name: "id_kardex", label: "ID", type: "string" },
  { name: "nombre", label: "Nombre", type: "string" },
  { name: "descripcion", label: "Descripcion", type: "string" },
  { name: "cantidad", label: "Cantidad", type: "number" },
  { name: "cantidad_paquete", label: "Unidad Paquete", type: "number" },
  { name: "nombre_medida", label: "Medida", type: "string" },
  { name: "categoria", label: "Categoria", type: "string" },
  { name: "codigo", label: "Codigo", type: "string" },
  { name: "estante", label: "Estante", type: "string" },
  { name: "fila", label: "Fila", type: "string" },
];

export type filaInventarioEstado = {
  id_solicitud: number;
  nombre_bodega: string;
  fecha_emision: string;
  fecha_aprobado: string;
  usuario_solicitante: string;
  usuario_aprobador: string;
  productos: any[];
};

export const COLUMNAS_INVENTARIO_ESTADO: GridColDef[] = [
  { field: "id_solicitud", headerName: "ID", type: "string", width: 50 },
  { field: "nombre_bodega", headerName: "Nombre", type: "string", width: 150 },
  { field: "fecha_emision", headerName: "Fecha Realizado", type: "string", width: 130 },
  { field: "fecha_aprobado", headerName: "Fecha Aprobado", type: "string", width: 130 },
  { field: "usuario_solicitante", headerName: "Solicita", type: "string", width: 180 },
  { field: "usuario_aprobador", headerName: "Aprueba", type: "string", width: 180 },

];

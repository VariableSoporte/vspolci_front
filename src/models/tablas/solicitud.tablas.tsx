import { GridColDef } from "@mui/x-data-grid";

export type solicitudFila = {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidad_paquete: number;
  medida: string;
  categoria: string;
  codigo: string;
  activo: number;
};

export const COLUMNAS_SOLICITUD: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "nombre",
    headerName: "Nombre",
    width: 130,
    renderCell: (params) => (
      <span title={params.row.descripcion}>{params.value}</span>
    ),
  },
  {field: "cantidad", headerName: "Cantidad", type: "number"},
  {
    field: "cantidad_paquete",
    headerName: "Uni. Paquete",
    type: "number",
    width: 130,
  },
  { field: "medida", headerName: "Medida", type: "number", width: 130 },
  { field: "categoria", headerName: "Categoria", type: "number", width: 130 },
  { field: "codigo", headerName: "Codigo", type: "number", width: 130 },
  {
    field: "activo",
    headerName: "Estado",
    type: "number",
    width: 130,
    sortable: false,
    valueGetter: (value) => (value == 1 ? "Activo" : "Inactivo"),
  },
  /*{ field: "fullName", headerName: "Medida", description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
    },*/
];
/*
export const COLUMNAS_INSUMOS_CREAR = [
  { name: "nombre", label: "Nombre", type: "string" },
  { name: "descripcion", label: "Descripcion", type: "string" },
  { name: "cantidad_paquete", label: "Unidad Paquete", type: "number" },
  { name: "medida", label: "Medida", type: "string" },
  { name: "categoria", label: "Categoria", type: "string" },
  { name: "codigo", label: "Codigo", type: "string" },
];
*/
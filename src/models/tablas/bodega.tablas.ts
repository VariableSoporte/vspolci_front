import { GridColDef } from "@mui/x-data-grid";

export type filaBodega = {
  id: number;
  nombre: string;
  ciudad: string;
  zona: number;
};

export const COLUMNAS_BODEGAS: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 260 },
  { field: "ciudad", headerName: "Ciudad", width: 260 },
  { field: "zona", headerName: "Zona", width: 260 },
];
export const COLUMNAS_BODEGAS_CREAR = [
  { name: "nombre", label: "Nombre", type: "string" },
  { name: "ciudad", label: "Ciudad", type: "string" },
  { name: "zona", label: "Zona", type: "string" }
];

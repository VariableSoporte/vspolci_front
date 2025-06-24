import { GridColDef } from "@mui/x-data-grid";

export type filaUsuario = {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasenia: string;
  activo: number;
  id_bodega_per: number;
  permisos: number;
};
/*
id_usuario: usuario.id,
          nombres: usuario.nombre,
          apellidos: usuario.apellido,
          correo: usuario.correo,  
          contrasenia: usuario.contrasenia,
          activo: usuario.activo | 1,
          id_bodega_per: usuario.id_bodega,
          permisos: usuario.permiso,
*/

export const COLUMNAS_USUARIOS: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombres", width: 130 },
  { field: "apellido", headerName: "Apellidos", width: 260 },
  {
    field: "correo",
    headerName: "Correo",
    width: 130,
  },
  {
    field: "activo",
    headerName: "Estado",
    type: "number",
    width: 130,
    sortable: false,
    valueGetter: (value) => (value == 1 ? "Activo" : "Inactivo"),
  },
  { field: "id_bodega", headerName: "Bodega", type: "number", width: 130 },
  { field: "permiso", headerName: "Permisos", type: "number", width: 130 },
  /*{ field: "fullName", headerName: "Medida", description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
    },*/
];
export const COLUMNAS_USUARIOS_CREAR = [
  { name: "nombres", label: "Nombres", type: "string" },
  { name: "apellidos", label: "Apellidos", type: "string" },
  { name: "correo", label: "Correo", type: "string" },
  { name: "id_bodega_per", label: "Bodega", type: "string" },
  { name: "permisos", label: "Permisos", type: "string" }
];

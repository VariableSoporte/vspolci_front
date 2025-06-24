"use client";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import "./Tabla.css";

export type TablaProps = {
  columnas: GridColDef[];
  filas: any[];
  onRowSelect: (row: any) => void;
};

const paginationModel = { page: 0, pageSize: 5 };

export const Tabla: React.FC<TablaProps> = ({columnas, filas, onRowSelect}) => {

  const handleRowClick = (params: GridRowParams) => {
    onRowSelect(params.row);
  };

  const getRowClassName = (params: GridRowParams) => {
    return params.row.activo === 0 ? "inactive-row" : ""; // Si 'activo' es 0, aplicar clase
  };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={filas}
        columns={columnas}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        //onRowClick={handleRowClick}
        onRowDoubleClick={handleRowClick}
        getRowClassName={getRowClassName}
        //checkboxSelection
        sx={{ border: 0 }}
        getRowId={(row) => row.id || row.id_kardex || row.id_solicitud}
      />
    </Paper>
  );
};

export default Tabla;


"use client";
import React, { useEffect, useState } from "react";
import "./TablaUsuarios.css";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { MySQLBodegaRepositorio } from "../../../../lib/bodega/infraestructura/mySQLBodegaRepositorio";
import { crearBodegaServicios } from "../../../../lib/bodega/aplicacion/bodegaServicios";
import { Bodega } from "../../../../lib/bodega/dominio";

export type TablaUsuariosProps = {
  columnas: GridColDef[];
  filas: any[];
  onRowSelect: (row: any) => void;
};

const paginationModel = { page: 0, pageSize: 5 };

export const TablaUsuarios: React.FC<TablaUsuariosProps> = ({
  columnas,
  filas,
  onRowSelect,
}) => {
	const repositorio = MySQLBodegaRepositorio();
  const serviciosBodega = crearBodegaServicios(repositorio);
  const [listBodegas, setListBodegas] = useState<Bodega[]>([]);
  const [filaActualizada, setFilaActualizada] = useState<any[]>(filas);

  const handleRowClick = (params: GridRowParams) => {
	console.log(params.row, "params")
    onRowSelect(params.row);
  };

  const getRowClassName = (params: GridRowParams) => {
    return params.row.activo === 0 ? "inactive-row" : ""; // Si 'activo' es 0, aplicar clase
  };

  const fetchBodegas = async () => {
    try {
      const result = await serviciosBodega.traerTodo();
      setListBodegas(result); 
	  const actualizado = filas.map((f) =>{
		console.log(f,"dentro del actualizado con f");
		const fi = listBodegas.find( (b) => b.id === f.id_bodega);
		//console.log(fi);
		if (fi){
			const retornar = {...f, id_bodega: fi.nombre, permiso: f.permiso == 1 ? "Administrador" : "Usuario", id_bodega_per: f.id_bodega, permiso_per: f.permiso};
			return retornar;
		}
		return f;
	  }) 


	  setFilaActualizada(actualizado);
	  
	
    } catch (error) {
      console.error("Error fetching al cargar bodegas:", error);
    }
  };

  useEffect(()=>{
	fetchBodegas(); 
  },[filas]);
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={filaActualizada}
        columns={columnas}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        //onRowClick={handleRowClick}
        onRowDoubleClick={handleRowClick}
        getRowClassName={getRowClassName}
        //checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};


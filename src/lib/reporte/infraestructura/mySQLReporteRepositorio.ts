import { CONEXION, CONEXION_REPORTES } from "../../shared/conexiones";
import { ReporteInsumos, ReporteRepositorio } from "../dominio";

export const MySQLReporteRepositorio = (): ReporteRepositorio => ({
  reporteInsumos: async () => {
    try {
      const response = await fetch(`${CONEXION.REPORTE_URL}`);
      if (!response.ok) {
        throw new Error("Error al obtener inventario");
      }
      const reporte = (await response.json()) as ReporteInsumos[];
      return reporte;
    } catch (error) {
      console.error("Error en traerTodo Inventario:", error);
      throw error;
    }
  },
  reporteSolicitudes: async () => {
    try {
      const response = await fetch(`${CONEXION_REPORTES.INVENTARIO_CONEXION_REPORTE_SOLICITUD}`);
      if (!response.ok) {
        throw new Error("Error al obtener inventario");
      }
      const reporte = (await response.json());
      return reporte;
    } catch (error) {
      console.error("Error en traerTodo Inventario:", error);
      throw error;
    }
  },
  reporteSolicitudesBodegas: async () => {
    try {
      const response = await fetch(`${CONEXION_REPORTES.INVENTARIO_CONEXION_REPORTE_SOLICITUD_BODEGAS}`);
      if (!response.ok) {
        throw new Error("Error al obtener reporte solicitud bodegas");
      }
      const reporte = (await response.json());
      return reporte;
    } catch (error) {
      console.error("Error en reporte solicitud bodegas:", error);
      throw error;    
    }
  },
  reporteReporteEntregas: async (id_bodega: number) => {
    try {
      const response = await fetch(`${CONEXION_REPORTES.INVENTARIO_CONEXION_REPORTE_ENTREGAS}`,{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          id_bodega: id_bodega
        })
      });
      if (!response.ok) {
        throw new Error("Error al obtener reporte entraga bodegas");
      }
      const reporte = (await response.json());
      return reporte;
    } catch (error) {
      console.error("Error en reporte entregas bodegas:", error);
      throw error;   
    }
  },
});

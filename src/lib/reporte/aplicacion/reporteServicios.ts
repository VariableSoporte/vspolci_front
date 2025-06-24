import { ReporteRepositorio } from "../dominio";

export const crearReporteServicios = (repositorio: ReporteRepositorio) => ({
  reporteInsumos: async () => await repositorio.reporteInsumos(),
  reporteSolicitud: async () => await repositorio.reporteSolicitudes(),
  reporteSalidasBodegas: async () => await repositorio.reporteSolicitudesBodegas(),
  reporteReporteEntregas: async (id_bodega: number) => await repositorio.reporteReporteEntregas(id_bodega),
  /*traerPorId: async (id:number) => await repositorio.traerPorId(id),
    crear: async (insumo: Inventario) => await repositorio.crear(insumo),
    editar: async (insumo: Inventario) => await repositorio.editar(insumo),
    eliminar: async (id: number) => await repositorio.eliminar(id)*/
});

import { Bodega, BodegaRepositorio } from "../dominio";

export const crearBodegaServicios = (repositorio: BodegaRepositorio) => ({
  traerTodo: async () => await repositorio.traerTodo(),
  traerPorId: async (id: number) => await repositorio.traerPorId(id),
  crear: async (bodega: Bodega) => await repositorio.crear(bodega),
  editar: async (bodega: Bodega) => await repositorio.editar(bodega),
  eliminar: async (id: number) => await repositorio.eliminar(id),
});
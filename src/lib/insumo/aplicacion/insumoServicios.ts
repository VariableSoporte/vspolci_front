import { InsumoRepositorio, Insumo } from "../dominio";

export const crearInsumoServicios = (repositorio: InsumoRepositorio) => ({
    traerTodo: async () => await repositorio.traerTodo(),
    traerPorId: async (id:number) => await repositorio.traerPorId(id),
    crear: async (insumo: Insumo) => await repositorio.crear(insumo),
    editar: async (insumo: Insumo) => await repositorio.editar(insumo),
    eliminar: async (id: number) => await repositorio.eliminar(id),
    traerPorBodega: async (id_bodega_per: number) => await repositorio.traerPorBodega(id_bodega_per),
    actualizarKardex: async (id_kardex: number, estante: string, fila: number) => await repositorio.actualizarKardex(id_kardex,estante,fila)
});


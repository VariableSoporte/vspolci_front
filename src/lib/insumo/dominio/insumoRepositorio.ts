import { Insumo, InsumoKardex } from "./insumo";

export interface InsumoRepositorio {
    traerTodo(): Promise<Insumo[]>;
    traerPorId(id:number): Promise<Insumo | null>;
    editar(insumo: Insumo): Promise<void>;
    crear(insumo: Insumo): Promise<void>;
    eliminar(id: number): Promise<void>;
    traerPorBodega(id_bodega_per:number): Promise<InsumoKardex[]>;
    actualizarKardex(id_kardex:number, estante:string,fila:number):Promise<void>;
}

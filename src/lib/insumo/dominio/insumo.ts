export interface Insumo {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad_paquete: number;
    medida: string;
    categoria: string;
    codigo: string;
    activo: number;
}

export const InsumoVacio: Insumo = {
    id : 0,
    nombre : "",
    descripcion : "",
    cantidad_paquete : 0,
    medida : "",
    categoria : "",
    codigo : "",
    activo : 0
}

export interface InsumoKardex {
    id_kardex : number;
    id_producto_per : number;
    nombre: string;
    descripcion : string;
    categoria : string;
    cantidad : number;
    estante : string;
    fila : number;
}

export const InsumoKardexVacio : InsumoKardex = {
    id_kardex : 0,
    id_producto_per : 0,
    nombre : "",
    descripcion : "",
    categoria : "",
    cantidad : 0,
    estante : "S/E",
    fila : 0
}
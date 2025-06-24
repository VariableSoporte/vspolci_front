export interface ReporteInsumos {
    id_producto: number;
    nombre: string;
    descripcion: string;
    cantidad_paquete: number;
    activo: number;
    total: number;
}

export type ReporteSalidasReporte = {
    id_salida: number,
    fecha_salida: string,
    cantidad: number,
    nombre: string,
    id_producto: number
}

export type ReporteSalidasBodegasReporte = {
    id_bodega: number,
    nombre: string,
    ciudad: string,
    fecha_salida: string,
    cantidad: number
}

export type ReporteEntregasReporte = {
    id_salida: number,
    id_kardex: number,
    insumo: string,
    cantidad: number,
    fecha_salida: string,
    bodega: string,
    ciudad: string
}
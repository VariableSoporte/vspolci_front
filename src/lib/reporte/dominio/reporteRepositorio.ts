import { ReporteEntregasReporte, ReporteInsumos, ReporteSalidasBodegasReporte } from "./reporte";

export interface ReporteRepositorio {
    reporteInsumos(): Promise <ReporteInsumos[]>;
    reporteSolicitudes(): Promise<any[]>;
    reporteSolicitudesBodegas():Promise<ReporteSalidasBodegasReporte[]>;
    reporteReporteEntregas(id_bodega: number):Promise<ReporteEntregasReporte[]>;
}
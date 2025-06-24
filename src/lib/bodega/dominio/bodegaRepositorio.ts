import { Bodega } from "./bodega";

export interface BodegaRepositorio {
  traerTodo(): Promise<Bodega[]>;
  traerPorId(id: number): Promise<Bodega | null>;
  crear(bodega: Bodega): Promise<void>;
  editar(bodega: Bodega): Promise<void>;
  eliminar(id: number): Promise<void>;
}

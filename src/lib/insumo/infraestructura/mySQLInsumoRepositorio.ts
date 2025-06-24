import { CONEXION, CONEXION_INSUMO } from "../../shared/conexiones";
import { Insumo, InsumoRepositorio } from "../dominio";

export const MySQLInsumoRepositorio = (): InsumoRepositorio => ({
  traerTodo: async () => {
    try {
      const response = await fetch(CONEXION.INSUMO_URL);
      if (!response.ok) {
        throw new Error("Error al obtener insumos");
      }
      const insumos = (await response.json()) as Insumo[];
      return insumos;
    } catch (error) {
      console.error("Error en traerTodo:", error);
      throw error;
    }
  },
  traerPorId: async (id: number) => {
    try {
      const response = await fetch(`${CONEXION.INSUMO_URL}${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener insumo con ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error en traerPorId:", error);
      throw error;
    }
  },
  editar: async (insumo: Insumo) => {
    try {
      const response = await fetch(CONEXION.INSUMO_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_insumo: insumo.id,
          nombre: insumo.nombre,
          descripcion: insumo.descripcion,
          cantidad_paquete: insumo.cantidad_paquete,
          nombre_medida: insumo.medida,
          categoria: insumo.categoria,
          codigo: insumo.codigo,
          activo: insumo.activo || 1,
        }),
      });
      console.log("antes del response.ok")
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al editar insumo";
        if (response.status === 401) {
          errorMessage = errorData.message || "Insumo no cumple con las características";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Insumo presenta errores";
        }
        throw new Error(errorMessage);
      }
      
     return response.json();
    } catch (error) {
      console.error("Error en editar:", error);
      throw error;
    }
  },
  crear: async (insumo: Insumo) => {
    try {
      const response = await fetch(CONEXION.INSUMO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_insumo: insumo.id,
          nombre: insumo.nombre,
          descripcion: insumo.descripcion,
          cantidad_paquete: insumo.cantidad_paquete,
          nombre_medida: insumo.medida,
          categoria: insumo.categoria,
          codigo: insumo.codigo,
          activo: insumo.activo | 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al crear insumo";
        if (response.status === 401) {
          errorMessage = errorData.message || "Insumo no cumple con las características";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Insumo presenta errores";
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("Error en crear:", error);
      throw error;
    }
  },
  eliminar: async (id: number) => {
    try {
      const response = await fetch(`${CONEXION.INSUMO_URL}${id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar insumo con ID: ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error en traerPorId:", error);
      throw error;
    }
  },
  traerPorBodega: async (id_bodega_per: number) => {
    try {
      const response = await fetch(`${CONEXION_INSUMO.INSUMO_CONEXION_BODEGA}${id_bodega_per}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar insumo con ID: ${id_bodega_per}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error en traerPorId:", error);
      throw error;
    }
    
  },
  actualizarKardex: async (id_kardex: number, estante: string, fila: number) => {
    try {
      const response = await fetch(CONEXION_INSUMO.INSUMO_CONEXION_KARDEX, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_kardex: id_kardex,
          estante: estante,
          fila: fila
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al editar kardex";
        if (response.status === 401) {
          errorMessage = errorData.message || "Kardex no cumple con las características";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Kardex presenta errores";
        }
        throw new Error(errorMessage);
      }
      
     return response.json();
    } catch (error) {
      console.error("Error en editar kardex:", error);
      throw error;
    }
  },
});

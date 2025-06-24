import { CONEXION } from "../../shared/conexiones";
import { Bodega, BodegaRepositorio } from "../dominio";


export const MySQLBodegaRepositorio = (): BodegaRepositorio => ({
    traerTodo: async () => {
      try {
        const response = await fetch(CONEXION.BODEGA_URL);
        if (!response.ok) {
          throw new Error("Error al obtener bodega");
        }
        const bodega = (await response.json()) as Bodega[];
        return bodega;
      } catch (error) {
        console.error("Error en traerTodo:", error);
        throw error;
      }
    },
    traerPorId: async (id: number)=>{
      try {
        const response = await fetch(`${CONEXION.BODEGA_URL}${id}`);
        if (!response.ok) {
          throw new Error(`Error al obtener bodega con ID ${id}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error en traerPorId:", error);
        throw error;
      }
    },
    crear: async (bodega: Bodega)=>{
      try {
        const response = await fetch(CONEXION.BODEGA_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_bodega: bodega.id,
            nombre: bodega.nombre,
            ciudad: bodega.ciudad,
            zona: bodega.zona
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          let errorMessage = "Error al crear bodega";
          if (response.status === 401) {
            errorMessage = errorData.message || "Bodega no cumple con las características";
          } else if (response.status === 404) {
            errorMessage = errorData.message || "Bodega presenta errores";
          }
          throw new Error(errorMessage);
        }
  
        return response.json();
      } catch (error) {
        console.error("Error en crear:", error);
        throw error;
      }
    },
    editar: async (bodega: Bodega)=>{
      try {
        const response = await fetch(CONEXION.BODEGA_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_bodega: bodega.id,
            nombre: bodega.nombre,
            ciudad: bodega.ciudad,
            zona: bodega.zona
          }),
        });
        console.log("antes del response.ok")
        if (!response.ok) {
          const errorData = await response.json();
          let errorMessage = "Error al editar bodega";
          if (response.status === 401) {
            errorMessage = errorData.message || "Bodega no cumple con las características";
          } else if (response.status === 404) {
            errorMessage = errorData.message || "Bodega presenta errores";
          }
          throw new Error(errorMessage);
        }
        
       return response.json();
      } catch (error) {
        console.error("Error en editar:", error);
        throw error;
      }
    },
    eliminar: async (id: number)=>{
      try {
        const response = await fetch(`${CONEXION.BODEGA_URL}${id}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar bodega con ID: ${id}`);
        }
        return response.json();
      } catch (error) {
        console.log("Error en eliminar:", error);
        throw error;
      }
    }
    
});


import { CONEXION } from "../../shared/conexiones";
import { Usuario, UsuarioRepositorio } from "../dominio";

interface dataLogin {
  token: string;
  usuario: Usuario;
}

export const MySQLUsuarioRepositorio = (): UsuarioRepositorio => ({
  traerTodo: async () => {
    const usuarios = await fetch(CONEXION.USUARIO_URL).then((res) =>
      res.json()
    );
    return await usuarios;
  },
  traerPorId: (id: number) => {
    return Promise.resolve(
      fetch(CONEXION.USUARIO_URL + id).then((res) => res.json())
    );
  },
  autenticar: async (correo, contrasenia) => {
    try {
      const response = await fetch(CONEXION.LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          contrasenia: contrasenia,
        }),
      });

      if (response.status === 401) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Usuario o contraseña no cumple con las caracteristicas"
        );
      } else if (response.status === 404) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenciales incorrectas");
      } else if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la autenticación");
      }

      const data: dataLogin = await response.json();
      const user: Usuario = {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        correo: data.usuario.correo,
        contrasenia: data.usuario.contrasenia,
        id_bodega: data.usuario.id_bodega,
        permiso: data.usuario.permiso,
        activo: data.usuario.activo,
        token: data.token,
      };
      return user; // Devuelve los datos recibidos (por ejemplo, un token o información del usuario)
    } catch (error) {
      //console.error("Error en la autenticación:", error);
      throw error; // Lanza el error para manejarlo fuera de la función
    }
  },
  editar: async (usuario: Usuario) => {
    try {
      const response = await fetch(CONEXION.USUARIO_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: usuario.id,
          nombres: usuario.nombre,
          apellidos: usuario.apellido,
          correo: usuario.correo,
          contrasenia: usuario.contrasenia,
          activo: usuario.activo ? 1 : 0 ,
          id_bodega_per: usuario.id_bodega,
          permisos: usuario.permiso,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al editar usuario";
        if (response.status === 401) {
          errorMessage =
            errorData.message || "Usuario no cumple con las características";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Usuario presenta errores";
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("Error en editar:", error);
      throw error;
    }
  },
  crear: async (usuario: Usuario) => {
    try {
      const response = await fetch(CONEXION.USUARIO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: usuario.nombre,
          apellidos: usuario.apellido,
          correo: usuario.correo,
          contrasenia: usuario.contrasenia,
          activo: usuario.activo | 1,
          id_bodega_per: usuario.id_bodega,
          permisos: usuario.permiso,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Error al crear usuario";
        if (response.status === 401) {
          errorMessage = errorData.message || "Usuario no cumple con las características";
        } else if (response.status === 404) {
          errorMessage = errorData.message || "Usuario presenta errores";
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
      const response = await fetch(`${CONEXION.USUARIO_URL}${id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar usuario con ID: ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error en eliminar:", error);
      throw error;
    }
  },
});

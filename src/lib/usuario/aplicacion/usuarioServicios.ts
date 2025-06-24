import { Usuario, UsuarioRepositorio } from "../dominio";

export const crearUsuarioServicios = (repositorio: UsuarioRepositorio) => ({
    traerTodo: async () => await repositorio.traerTodo(),
    traerPorId: async (id: number) => await repositorio.traerPorId(id),
    autenticar: async (correo: string, contrasenia: string) => await repositorio.autenticar(correo, contrasenia),
    editar: async (usuario: Usuario) => await repositorio.editar(usuario),
    crear: async (usuario: Usuario) => await repositorio.crear(usuario),
    eliminar: async (id: number) => await repositorio.eliminar(id)
});
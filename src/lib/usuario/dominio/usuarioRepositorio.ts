import { Usuario } from "./usuario";

export interface UsuarioRepositorio {
    traerTodo(): Promise <Usuario[]>;
    traerPorId(id: number):Promise<Usuario | null>;
    autenticar(correo: string, contrasenia: string): Promise<Usuario | null>;
    editar(usuario: Usuario): Promise <void>;
    crear(usuario: Usuario): Promise <void>;
    eliminar(id: number): Promise <void>;
}
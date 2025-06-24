export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    contrasenia: string;
    id_bodega: number;
    permiso: number;
    activo: number;
    token: string;
}


export function esValidoCorreo ( correo: string ): boolean{
    const expresionRegular = /^[^\s@,"^;<>!#$&¿?\/()=\[\]*\\\x00-\x1F\x80-\xFF]+@[^\s@,"^;<>!#$&¿?\/()=\[\]*\\\x00-\x1F\x80-\xFF]+\.[^\s@,"^;<>!#$&¿?\/()=\[\]*\\\x00-\x1F\x80-\xFF]+$/;
        
    return expresionRegular.test(correo)
}

export function garantizaCorreoValido ( correo : string): void{
    if (!esValidoCorreo(correo)){
        throw new Error(`El correo ${correo} : no es una direccion valida`);
    }
}
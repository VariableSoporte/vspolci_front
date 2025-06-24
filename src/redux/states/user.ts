import { createSlice } from "@reduxjs/toolkit";
import { UsuarioVacio } from "../../lib/usuario/dominio";
import { Keys } from "../../models";
import { eliminarLocalStorage, obtenerLocalStorage, persistenciaLocalStorage } from "../../utilities";


export const userSlice = createSlice({
    name: Keys.USUARIO,
    //initialState: localStorage.getItem(Keys.USUARIO) ? JSON.parse(localStorage.getItem(Keys.USUARIO) as string) : UsuarioVacio,
    initialState: obtenerLocalStorage(Keys.USUARIO) || UsuarioVacio,
    reducers: {
        createUser: (_state, action)=> {
            persistenciaLocalStorage(Keys.USUARIO, action.payload);
            return action.payload;
        },
        updateUser: (state, action)=>{
            const result = { ...state, ...action.payload};
            persistenciaLocalStorage(Keys.USUARIO, result);
            return result;
        },
        resetUser: ()=> {
            eliminarLocalStorage(Keys.USUARIO);
            return UsuarioVacio;
        }
    }
});

export const { createUser, updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
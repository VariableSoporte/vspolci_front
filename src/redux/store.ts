import { configureStore } from "@reduxjs/toolkit";
import { AppStore } from "../lib/usuario/dominio";
import userSliceReducer from "./states/user";



export default configureStore<AppStore>({
    reducer: {
        usuario: userSliceReducer
    }
});
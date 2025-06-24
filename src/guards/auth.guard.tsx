import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { AppStore } from "../lib/usuario/dominio";
import { Keys, PublicRoutes } from "../models";
import { obtenerLocalStorage } from "../utilities";

export const AuthGuard = () => {
    const userState = useSelector((store: AppStore) => store.usuario);

    const isAuthenticated = userState.nombre && obtenerLocalStorage(Keys.USUARIO);


    return isAuthenticated ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN}/>;
    //return (userState.nombre ) ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN}/>;

};

export default AuthGuard;
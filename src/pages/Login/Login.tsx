"use client";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearUsuarioServicios } from "../../lib/usuario/aplicacion/usuarioServicios";
import { MySQLUsuarioRepositorio } from "../../lib/usuario/infraestructura/mySQLUsuarioRepositorio";
import { PrivatesRoutes } from "../../models";
import { createUser } from "../../redux/states/user";
import "./Login.css";
import Avatar from "@mui/material/Avatar";

export type LoginProps = {
  // types...
};

const Login: React.FC<LoginProps> = ({}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const repositorio = MySQLUsuarioRepositorio();
  const servicios = crearUsuarioServicios(repositorio);
  const [error, setError] = useState<String | null>(null);
  const navigate = useNavigate();

  useEffect ( () => {
    setError(null);
  },[username, password]);
  
  const handleLogin = async () => {
    try {
      setError(null);
      const result = await servicios.autenticar(username, password); // Implementa este método en tus servicios
      dispatch(createUser(result));
      navigate(`/${PrivatesRoutes.PRIVATE}`, { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido en el inicio de sesión"
      );
    }
  };
  const handleForgotPassword = () => {
    console.log("Redireccionar a recuperación de contraseña...");
    // Aquí podrías redirigir a una página de recuperación de contraseña o mostrar un mensaje
  };
  return (
    <div className="login">
      <div className="izquierda">
        <img className="bg_izquierda" src="./policia_quito.jpg" alt="imagen" />
      </div>
      <div className="derecha">
        <div className="modal">
          <Avatar
            className="avatar_logo"
            alt="Logo policia cientifica"
            src="./logo_policia_cientifica.svg"
            sx={{ width: 150, height: 150 }}
          />
          <Card className="card_modal" sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Iniciar Sesión
              </Typography>
              <TextField
                fullWidth
                label="Usuario"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error} {/* Mostrar el mensaje de error */}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ marginTop: "16px" }}
              >
                Ingresar
              </Button>
              <Button
                fullWidth
                color="secondary"
                onClick={handleForgotPassword}
                sx={{ marginTop: "8px" }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

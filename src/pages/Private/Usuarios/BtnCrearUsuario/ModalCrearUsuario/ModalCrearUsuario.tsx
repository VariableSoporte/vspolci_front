"use client";
import React, { useState } from "react";
import "./ModalCrearUsuario.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { ModalNuevoStyleUsuario } from "./ModalStyleUsuario";
import { UsuarioVacio } from "../../../../../lib/usuario/dominio";
import MenuItem from "@mui/material/MenuItem";
import { Bodega } from "../../../../../lib/bodega/dominio";
import { BtnCancelar, BtnGuardar } from "../../../../../components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export type ModalCrearUsuarioProps = {
  open: boolean;
  onClose: () => void;
  handleSave: (data: any) => void;
  listaBodegas: Bodega[];
};

const ModalCrearUsuario: React.FC<ModalCrearUsuarioProps> = ({
  open,
  onClose,
  handleSave,
  listaBodegas,
}) => {
  const [formData, setFormData] = useState<any>({
    ...UsuarioVacio,
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };



  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
	if (name === "confirmPassword" || name === "password") {
		setPasswordError(false); // Ocultar el error cuando el usuario empieza a corregir
	  }
  };

  // Función para guardar los datos
  const handleGuardar = () => {
	  console.log("antes de guardar:", formData);
	if (formData.password !== formData.confirmPassword) {
		setPasswordError(true);
		return; // No guardar si las contraseñas no coinciden
	  }
	  const { password, confirmPassword, ...dataToSave } = formData; // Excluir campos innecesarios
	  
    handleSave({...dataToSave, contrasenia: password}); // Llama a la función de guardado con los datos
    console.log("Datos guardados:", dataToSave);
    setFormData({
		...UsuarioVacio,
		password: "",
		confirmPassword: "",
	  });
    onClose(); // Cierra el modal
  };

  const handleOnClose = ()=>{
	setFormData({
		...UsuarioVacio,
		password: "",
		confirmPassword: "",
	  });
	onClose();
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalNuevoStyleUsuario}>
        <h2 id="modal-title">Crear Usuario</h2>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
          <TextField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
          <TextField
            label="Estado"
            name="activo"
            select
            value={formData.activo ? 1 : 0}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Bodega"
            name="id_bodega"
            select
            value={formData.id_bodega || ""}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            {listaBodegas.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Permiso"
            name="permiso"
            select
            value={formData.permiso ? 1 : 0}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            <MenuItem key={1} value={1}>
              Usuario
            </MenuItem>
            <MenuItem key={0} value={0}>
              Administrador
            </MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl sx={{ width: "48%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Contraseña
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
			  name="password"
			  value={formData.password}
			  onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
            />
          </FormControl>
          <FormControl sx={{ width: "48%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password-confirmar">
              Confirmar Contraseña
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-confirmar"
              type={showPassword ? "text" : "password"}
			  name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar Contraseña"
            />
          </FormControl>
        </Box>
		{passwordError && (
          <Box sx={{ color: "red", marginTop: "8px" }}>
            Las contraseñas no coinciden. Por favor, inténtalo nuevamente.
          </Box>
        )}
        {/* Botones de acción */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <BtnCancelar onClose={handleOnClose} />
          <BtnGuardar handleGuardar={handleGuardar} texto="Guardar" />
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCrearUsuario;

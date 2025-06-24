"use client";
import React, { useState } from 'react';
import './BtnCrearUsuario.css';
import Button from "@mui/material/Button";
import { ModalCrearUsuario } from './ModalCrearUsuario';
import { Usuario } from '../../../../lib/usuario/dominio';
import { Bodega } from '../../../../lib/bodega/dominio';

export type BtnCrearUsuarioProps = {
	text?: string;
  onCreate?: (p: any) => void;
  listaBodegas: Bodega[]
  // types...
}

export const BtnCrearUsuario: React.FC<BtnCrearUsuarioProps>  = ({text = "Crear Usuario", onCreate, listaBodegas}) => {
	const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Función para manejar el guardado
  const handleSave = (data: Usuario) => {
    console.log("Datos recibidos del modal:", data);
    if (onCreate){
      onCreate(data);
    }
    // Aquí puedes enviar los datos al backend o actualizar el estado global
  };
	return (
		<>
		<Button className="btnnuevo" onClick={handleOpen}  variant="outlined" color="primary">
        {text}
      </Button>
      <ModalCrearUsuario open={open} onClose={handleClose} handleSave={handleSave} listaBodegas={listaBodegas} />
		</>
	);
};


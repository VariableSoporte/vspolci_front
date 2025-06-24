"use client";
import React, { useState } from "react";
import "./BtnNuevo.css";
import Button from "@mui/material/Button";
import ModalNuevo from "./Modal/Modal";

export type BtnNuevoProps = {
  text: string;
  fields: any;
  onCreate?: (p: any) => void;
  // types...
};

export const BtnNuevo: React.FC<BtnNuevoProps> = ({ text, fields, onCreate }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Función para manejar el guardado
  const handleSave = (data: any) => {
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
      <ModalNuevo open={open} onClose={handleClose} fields={fields} handleSave={handleSave}  />
    </>
  );
};

export default BtnNuevo;

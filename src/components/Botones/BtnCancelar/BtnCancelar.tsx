"use client";
import Button from "@mui/material/Button";
import React from "react";
import "./BtnCancelar.css";

export type BtnCancelarProps = {
  onClose : () => void;
};

export const BtnCancelar: React.FC<BtnCancelarProps> = ({onClose}) => {
  return (
    <Button variant="outlined" onClick={onClose} color="error">
      Cancelar
    </Button>
  );
};

export default BtnCancelar;

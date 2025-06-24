"use client";
import React, { useState } from "react";
import "./BtnGuardar.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export type BtnGuardarProps = {
  handleGuardar: () => void;
  texto?: string;
  mensajeConfirmacion?:string;
  habilitar?:boolean;
};

export const BtnGuardar: React.FC<BtnGuardarProps> = ({
  handleGuardar,
  texto = "Guardar",
  mensajeConfirmacion = "¿Desea guardar este contenido?",
  habilitar = false
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function runSave() {
    handleGuardar();
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} variant="outlined" disabled={habilitar} color="primary">
        {texto}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensajeConfirmacion}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={runSave} autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default BtnGuardar;

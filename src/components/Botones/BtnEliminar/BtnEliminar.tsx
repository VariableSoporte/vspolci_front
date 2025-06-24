"use client";
import React, { useState } from "react";
import "./BtnEliminar.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export type BtnEliminarProps = {
  onDelete: () => void;
};

export const BtnEliminar: React.FC<BtnEliminarProps> = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function runDelete() {
      onDelete();
  }
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} color="error">
        Eliminar
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Desea eliminar este contenido?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={runDelete} autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default BtnEliminar;

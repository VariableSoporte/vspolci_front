"use client";
import React from "react";
import "./ModalEstados.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { BtnCancelar } from "../../../../components";
import { ListaPedido } from "../../../../lib/inventario/dominio";
import { ModalDataStyleEst } from "./stylesModal";

export type ModalEstadosProps = {
  open: boolean;
  onClose: () => void;
  row: ListaPedido[];
  text?: string;
};

const ModalEstados: React.FC<ModalEstadosProps> = ({
  open,
  onClose,
  row,
  text = "Lista de insumos",
}) => {
  return (
    <div className="modalestados">
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={ModalDataStyleEst}>
          <h2 id="modal-title">{text}</h2>
          {row.map((fila, index) => {
            return (
              <div key={index}>

                <TextField
                  label="Nombre"
                  value={fila.nombre_producto}
                  sx={{ width: "70%" }}
                  margin="normal"
                />
                <TextField
                  label="Solicitado"
                  value={fila.cantidad}
                  sx={{ width: "15%" }}
                  margin="normal"
                />
                <TextField
                  label="Enviado"
                  value={fila.cantidad_enviada}
                  sx={{ width: "15%" }}
                  margin="normal"
                />
              </div>
            );
          })}

          <BtnCancelar onClose={onClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEstados;

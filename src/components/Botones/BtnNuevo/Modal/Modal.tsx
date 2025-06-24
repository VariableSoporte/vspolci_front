"use client";
import React, { useState } from 'react';
import './Modal.css';
"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { BtnCancelar } from '../../BtnCancelar';
import { BtnGuardar } from '../../BtnGuardar';
import { ModalNuevoStyle } from './ModalStyle';

export type ModalProps = {
	open: boolean;
  onClose: () => void;
  fields: { name: string; label: string, type: string }[]; // Lista de campos
  handleSave: (data: any) => void;
}

export const ModalNuevo: React.FC<ModalProps>  = ({open, onClose, fields, handleSave}) => {
	const [formData, setFormData] = useState<any>({});

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los datos
  const handleGuardar = () => {
    handleSave(formData); // Llama a la función de guardado con los datos
    console.log("Datos guardados:", formData);
    setFormData({})
    onClose(); // Cierra el modal
  };
	return (
		<Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalNuevoStyle}>
        <h2 id="modal-title">Nuevo Registro</h2>

        {/* Renderizar dinámicamente los campos */}
        {fields.map((field, index) => (
          <TextField
            key={index}
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
			//type='number'
			type={field.type === "string" ? 'string' : 'number'}
          />
        ))}

        {/* Botones de acción */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <BtnCancelar onClose={onClose} />
          <BtnGuardar handleGuardar={handleGuardar} texto="Guardar" />
        </Box>
      </Box>
    </Modal>
	);
};

export default ModalNuevo;

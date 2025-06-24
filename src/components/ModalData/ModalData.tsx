"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import "./ModalData.css";
import { ModalDataStyle } from "./ModalDataStyle";
import { BtnCancelar, BtnEliminar, BtnGuardar } from "../Botones";

export type ModalDataProps = {
  open: boolean;
  onClose: () => void;
  row: any;
  text?: string;
  deshabilitado?: string[];
  handleFunction? : (val: any)=> void;
  actualizar?:  React.Dispatch<React.SetStateAction<any[]>>;
  onDelete?: (id: number)=> void;
};


export const ModalData: React.FC<ModalDataProps> = ({ open, onClose, row, text = "EDITAR INSUMO", deshabilitado = [], handleFunction, actualizar, onDelete }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (open) setFormData(row);
  }, [open, row]);

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };



  // Función para guardar los cambios
  const handleSave =  () => {
    const updatedFormData = { ...formData, activo: 1 };
    if ( handleFunction ) { 
       handleFunction(updatedFormData); 
      };
      console.log("Datos guardados:", updatedFormData);
      if (actualizar) {
        actualizar((prevRows: any[]) =>
           prevRows.map((item) => (item.id === updatedFormData.id ? updatedFormData : item))
        );
      }
      onClose();
  };

  const eliminar = async () => {
    try {
      if (onDelete){
          const response = await onDelete(formData.id)
          console.log("Datos eliminados correctamente", response)
          if (actualizar && response) {
            actualizar((prevRows: any[]) => 
              prevRows.filter((item) => item.id !== formData.id)
            );
          }
          onClose();
      }
      
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
    
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalDataStyle}>
        <h2 id="modal-title">{text}</h2>

        {/* Renderizado de dos campos por fila */}
        {Object.keys(formData).map((key, index) =>
          index % 2 === 0 ? (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
                sx={{ width: "48%" }}
                margin="normal"
                disabled={deshabilitado.includes(key)} // Deshabilitar si el campo está en el array
              />
              {/* Verifica si hay un segundo campo y lo renderiza en la misma fila */}
              {Object.keys(formData)[index + 1] && (
                <TextField
                  label={
                    Object.keys(formData)[index + 1].charAt(0).toUpperCase() +
                    Object.keys(formData)[index + 1].slice(1)
                  }
                  name={Object.keys(formData)[index + 1]}
                  value={formData[Object.keys(formData)[index + 1]] || ""}
                  onChange={handleInputChange}
                  sx={{ width: "48%" }}
                  margin="normal"
                  disabled={deshabilitado.includes(Object.keys(formData)[index + 1])} // Deshabilitar si el campo está en el array
                />
              )}
            </Box>
          ) : null
        )}
        <BtnGuardar handleGuardar={handleSave} texto="Guardar" />
        <BtnCancelar onClose={onClose} />
        <BtnEliminar onDelete={eliminar} />
      </Box>
    </Modal>
  );
};

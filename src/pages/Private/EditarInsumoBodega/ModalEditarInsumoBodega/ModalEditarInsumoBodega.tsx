"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { ModalDataStyle } from "./ModalDataStyle";
import "./ModalEditarInsumoBodega.css";
import { BtnCancelar, BtnGuardar } from "../../../../components";

export type ModalEditarInsumoBodegaProps = {
  open: boolean;
  onClose: () => void;
  row: any;
  text?: string;
  deshabilitado?: string[];
  handleFunction?: (id_kardex:number, estante:string, fila: number) => void;
  actualizar?: React.Dispatch<React.SetStateAction<any[]>>;
  onDelete?: (id: number) => void;
};

export const ModalEditarInsumoBodega: React.FC<ModalEditarInsumoBodegaProps> = ({
  open,
  onClose,
  row,
  text = "EDITAR INSUMO",
  deshabilitado = [],
  handleFunction,
  actualizar,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (open) setFormData(row);
  }, [open, row]);

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
	if (name === "fila" && parseInt(value) < 0){
		setFormData((prev: any) => ({ ...prev, [name]: 0 }));
	}else {
		setFormData((prev: any) => ({ ...prev, [name]: value }));
	}
  };

  // Función para guardar los cambios
  const handleSave = () => {
    const updatedFormData = { ...formData };
    if (handleFunction) {
      handleFunction(formData.id_kardex,formData.estante,formData.fila);
    }
    console.log("Datos guardados:", formData);
    if (actualizar) {
      actualizar((prevRows: any[]) =>
        prevRows.map((item) =>
          item.id_kardex === updatedFormData.id_kardex ? updatedFormData : item
        )
      );
    }
    onClose();
  };

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
          (index % 2 === 0 && key !== "id_kardex") ? (
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
				  type={Object.keys(formData)[index + 1]=="fila"?"number":"text"}
				  InputProps={{
                    inputProps: {
                      min: 0,
                      max:30
                    },
                  }}
                  value={formData[Object.keys(formData)[index + 1]] || ""}

                  onChange={handleInputChange}
                  sx={{ width: "48%" }}
                  margin="normal"
                  disabled={deshabilitado.includes(
                    Object.keys(formData)[index + 1]
                  )} // Deshabilitar si el campo está en el array
                />
              )}
            </Box>
          ) : null
        )}
        <BtnGuardar handleGuardar={handleSave} texto="Guardar" />
        <BtnCancelar onClose={onClose} />
      </Box>
    </Modal>
  );
};


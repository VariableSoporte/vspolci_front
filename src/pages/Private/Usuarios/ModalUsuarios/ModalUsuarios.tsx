"use client";
import React, { useEffect, useState } from "react";
import "./ModalUsuarios.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { ModalDataStyleUser } from "./ModalDataStyleUser";
import { BtnCancelar, BtnEliminar, BtnGuardar } from "../../../../components";
import { Bodega } from "../../../../lib/bodega/dominio";
import MenuItem from '@mui/material/MenuItem';

export type ModalUsuariosProps = {
  open: boolean;
  onClose: () => void;
  row: any;
  text?: string;
  handleFunction?: (val: any) => void;
  actualizar?: React.Dispatch<React.SetStateAction<any[]>>;
  onDelete?: (id: number) => void;
  listaBodegas: Bodega[];
};

export const ModalUsuarios: React.FC<ModalUsuariosProps> = ({
  open,
  onClose,
  row,
  text = "EDITAR USUARIO",
  handleFunction,
  actualizar,
  onDelete,
  listaBodegas
}) => {
  
  const [formData, setFormData] = useState<any>({
    id:"",
    nombre: "",
    apellido: "",
    correo: "",
    contrasenia: "",
    activo: 0,
    id_bodega: 0,
    permiso: 0
  });

  useEffect(() => {
	console.log(row, "use effect modal usuario");
    if (open) {
      setFormData({
        id: row.id || "",
        nombre: row.nombre || "",
        apellido: row.apellido || "",
        correo: row.correo || "",
        contrasenia: row.contrasenia || "",
        activo: row.activo || 0,
        id_bodega: row.id_bodega_per || 0,
        permiso: row.permiso_per || 0,
    });
    };
  }, [open, row]);


  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los cambios
  const handleSave = () => {
    const updatedFormData = { ...formData };
    if (handleFunction) {
      handleFunction(updatedFormData);
    }
    console.log("Datos guardados:", updatedFormData);
    if (actualizar) {
      actualizar((prevRows: any[]) =>
        prevRows.map((item) =>
          item.id === updatedFormData.id ? updatedFormData : item
        )
      );
    }
    onClose();
  };

  const eliminar = () => {
    if (onDelete) {
      onDelete(formData.id);
      console.log("Datos eliminados correctamente");
      onClose();
    }
    if (actualizar) {
      actualizar((prevRows: any[]) =>
        prevRows.filter((item) => item.id !== formData.id)
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalDataStyleUser}>
        <h2 id="modal-title">{text}</h2>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
            disabled // Deshabilitar si el campo está en el array
          />

          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
          <TextField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Estado"
            name="activo"
            select
            value={formData.activo || 0}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            <MenuItem  value={1} >
              Activo
            </MenuItem>
            <MenuItem  value={0} >
              Inactivo
            </MenuItem>
          </TextField>
          <TextField
            label="Bodega"
            name="id_bodega"
            select
            value={ formData.id_bodega || ""}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            {listaBodegas.map((option) => (
            <MenuItem key={option.id} value={option.id} >
              {option.nombre}
            </MenuItem>
          ))}
          </TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Contraseña"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
			type="password"
          />
          <TextField
            label="Permiso"
            name="permiso"
            select
            value={formData.permiso ? 1 : 0}
            onChange={handleInputChange}
            sx={{ width: "48%" }}
            margin="normal"
          >
            <MenuItem key={0} value={0}>
              Usuario
            </MenuItem>
            <MenuItem key={1} value={1}>
              Administrador
            </MenuItem>
          </TextField>
        </Box>

        <BtnGuardar handleGuardar={handleSave} texto="Guardar" />
        <BtnCancelar onClose={onClose} />
        <BtnEliminar onDelete={eliminar} />
      </Box>
    </Modal>
  );
};


"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BtnCancelar, BtnGuardar } from "../../../../components";
import {
  InventarioSolicitud
} from "../../../../lib/inventario/dominio";
import { AppStore } from "../../../../lib/usuario/dominio";
import "./ModalSolicitudes.css";
import { ModalDataStyleSol } from "./stylesModal";

export type ModalSolicitudesProps = {
  open: boolean;
  onClose: () => void;
  row: any;
  text?: string;
  handleFunction?: (val: any) => void;
  actualizar?: React.Dispatch<React.SetStateAction<InventarioSolicitud>>;
  dataPedido?: InventarioSolicitud;
  alerta: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
};

const ModalSolicitudes: React.FC<ModalSolicitudesProps> = ({
  open,
  onClose,
  row,
  text = "Agregar Pedido",
  actualizar,
  dataPedido,
  alerta,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [cantidad, setCantidad] = useState(1);
  const userState = useSelector((store: AppStore) => store.usuario);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) setFormData(row);
  }, [open, row]);

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (cantidad <= 0) {
      alerta(`La cantidad debe ser mayor que 0 `, "warning");
      onClose();
      return;
    }
    if (motivo.length == 0) {
      alerta(`Agrege un motivo de compra`, "warning");
      onClose();
      return;
    }

    const nuevoItem = {
      id_producto_per: formData.id,
      nombre_producto: formData.nombre,
      cantidad: cantidad,
      motivo: motivo,
      detalle_solicitud: "",
      cantidad_enviada: 0,
    };
    /*
		const total = formData.cantidad - cantidad;
	
		const updatedRow = {
		  ...formData,
		  cantidad: total,
		  informe,
		  solicitante,
		  area,
		};
	*/
    if (actualizar) {
      actualizar((prev) => ({
        ...prev,
        id_bodega_per: userState.id_bodega,
        id_bodega_sol: 1, // puedes ajustar este valor si es dinámico
        fecha_emision: new Date().toISOString().split("T")[0],
        id_usuario_sol: userState.id,
        pedido: [...prev.pedido, nuevoItem],
      }));
    }
	alerta("Producto añadido al pedido", "success");
    console.log("data pedido: ", dataPedido);

	setMotivo("");
    setCantidad(1);

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalDataStyleSol}>
        <h2 id="modal-title">{text}</h2>

        <TextField
          label="ID"
          //name={key}
          value={formData.id ?? ""}
          onChange={handleInputChange}
          sx={{ width: "36%" }}
          margin="normal"
          disabled={true} // Deshabilitar si el campo está en el array
        />

        <TextField
          label="Nombre"
          //name={Object.keys(formData)[index + 1]}
          value={formData.nombre ?? ""}
          onChange={handleInputChange}
          sx={{ width: "60%" }}
          margin="normal"
          disabled={true} // Deshabilitar si el campo está en el array
        />
        <TextField
          label="Unidad x Paquete"
          //name={Object.keys(formData)[index + 1]}
          value={formData.cantidad_paquete ?? ""}
          sx={{ width: "36%" }}
          margin="normal"
          disabled={true}
        />
        <TextField
          label="Cantidad"
          //name={Object.keys(formData)[index + 1]}
          type="number"
          value={cantidad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value);
            setCantidad(value > 0 ? value : 0);
          }}
          InputProps={{
            inputProps: { min: 1 },
          }}
          error={cantidad <= 0}
          sx={{ width: "60%" }}
          margin="normal"
          disabled={false}
        />
        <TextField
          label="Motivo"
          //name={Object.keys(formData)[index + 1]}
          type="string"
          value={motivo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setMotivo(value);
          }}
          error={motivo == ""}
          sx={{ width: "96%" }}
          margin="normal"
          disabled={false}
        />

        <BtnGuardar handleGuardar={handleSave} texto="Añadir" />
        <BtnCancelar onClose={onClose} />
      </Box>
    </Modal>
  );
};

export default ModalSolicitudes;

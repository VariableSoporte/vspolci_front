"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { ModalDataStyle } from "./stylesModal";
import "./ModalInventario.css";
import { BtnCancelar, BtnGuardar } from "../../../../components";
import { InventarioEntregaInsumo } from "../../../../lib/inventario/dominio";
import { MySQLInventarioRepositorio } from "../../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { crearInventarioServicios } from "../../../../lib/inventario/aplicacion/inventarioServicios";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../lib/usuario/dominio";

export type ModalInventarioProps = {
  open: boolean;
  onClose: () => void;
  row: any;
  text?: string;
  handleFunction?: (val: any) => void;
  actualizar?: React.Dispatch<React.SetStateAction<any[]>>;
  onDelete?: (id: number) => void;
  alerta: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
};

export const ModalInventario: React.FC<ModalInventarioProps> = ({
  open,
  onClose,
  row,
  text = "Entregar Insumo",
  actualizar,
  alerta,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [informe, setInforme] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [area, setArea] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const repositorio = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorio);
  const userState = useSelector((store: AppStore) => store.usuario);

  useEffect(() => {
    if (open) setFormData(row);
  }, [open, row]);

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };


  const handleSave = () => {
    if (!informe.trim()) {
      alerta("El campo 'Informe' es obligatorio", "warning");
      onClose();
      return;
    }

    if (!solicitante.trim()) {
      alerta("El campo 'Solicitante' es obligatorio", "warning");
      onClose();
      return;
    }
    
    if (!area.trim()) {
      alerta("El campo 'Área' es obligatorio", "warning");
      onClose();
      return;
    }
    
    if (cantidad <= 0 || cantidad > formData.cantidad) {
      alerta(
        `La cantidad debe ser mayor que 0 y menor o igual a ${formData.cantidad}`,
        "warning"
      );
      onClose();
      return;
    }

    const total = formData.cantidad - cantidad;

    const updatedRow = {
      ...formData,
      cantidad: total,
      informe,
      solicitante,
      area,
    };

    if (actualizar) {
      actualizar((prevRows: any[]) =>
        prevRows.map((item) =>
          item.id_kardex === row.id_kardex ? updatedRow : item
        )
      );
      setInforme("");
      setArea("");
      setSolicitante("");
      setCantidad(1);
    }

    fetchEntregaInventario({
      id_kardex: updatedRow.id_kardex,
      cantidad: cantidad,
      nombre_solicitante: updatedRow.solicitante,
      area: updatedRow.area,
      numero_informe: updatedRow.informe,
      disposicion_entrega: `${userState.nombre} ${userState.apellido}`,
    });

    onClose();
  };

  const fetchEntregaInventario = async (entrega: InventarioEntregaInsumo) => {
    try {
      await serviciosInventario.entregarInsumo(entrega);
      alerta("Cambios guardados", "success");
    } catch (error) {
      alerta("Error al entregar insumos", "error");
      if (error instanceof SyntaxError) {
        console.error(
          "Error de formato en JSON modal inventario:",
          error.message
        );
      } else {
        console.error("Error al guardar modal inventario:", error);
      }
    }
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

        <TextField
          label="ID"
          //name={key}
          value={formData.id_kardex ?? ""}
          onChange={handleInputChange}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={true} // Deshabilitar si el campo está en el array
        />

        <TextField
          label="Nombre"
          //name={Object.keys(formData)[index + 1]}
          value={formData.nombre ?? ""}
          onChange={handleInputChange}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={true} // Deshabilitar si el campo está en el array
        />
        <TextField
          label="Informe"
          //name={Object.keys(formData)[index + 1]}
          value={informe}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInforme(e.target.value);
          }}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={false} 
        />
        <TextField
          label="Cantidad"
          //name={Object.keys(formData)[index + 1]}
          type="number"
          value={cantidad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value);
            setCantidad(value > 0 && value <= row.cantidad ? value : 0);
          }}
          InputProps={{
            inputProps: { min: 1, max: parseInt(row.cantidad) ?? 10 },
          }}
          error={cantidad <= 0}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={false} 
        />
        <TextField
          label="Solicitante"
          //name={Object.keys(formData)[index + 1]}
          value={solicitante}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSolicitante(e.target.value);
          }}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={false} 
        />
        <TextField
          label="Area"
          //name={Object.keys(formData)[index + 1]}
          value={area}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setArea(e.target.value);
          }}
          sx={{ width: "48%" }}
          margin="normal"
          disabled={false} // Deshabilitar si el campo está en el array
        />

        <BtnGuardar handleGuardar={handleSave} texto="Entrega" />
        <BtnCancelar onClose={onClose} />
      </Box>
    </Modal>
  );
};

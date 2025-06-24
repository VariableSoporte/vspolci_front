import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteIcon from "@mui/icons-material/Delete";
import { dato, InventarioSolicitud } from "../../../../lib/inventario/dominio";
import { MySQLBodegaRepositorio } from "../../../../lib/bodega/infraestructura/mySQLBodegaRepositorio";
import { crearBodegaServicios } from "../../../../lib/bodega/aplicacion/bodegaServicios";
import { Bodega } from "../../../../lib/bodega/dominio";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MySQLInventarioRepositorio } from "../../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { crearInventarioServicios } from "../../../../lib/inventario/aplicacion/inventarioServicios";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type ListadoPedidosProps = {
  open: boolean;
  onClose: () => void;
  pedido: dato[];
  actualizarPedido: (nuevo: dato[]) => void;
  data_solicitud: InventarioSolicitud;
  alerta: (
    mensaje: string,
    tipo: "success" | "error" | "info" | "warning"
  ) => void;
};

export const ListadoPedidos: React.FC<ListadoPedidosProps> = ({
  open,
  onClose,
  pedido,
  actualizarPedido,
  data_solicitud,
  alerta,
}) => {
  const repositorio = MySQLBodegaRepositorio();
  const serviciosBodega = crearBodegaServicios(repositorio);
  const repositorioSol = MySQLInventarioRepositorio();
  const serviciosSol = crearInventarioServicios(repositorioSol);
  const [rowsBodegas, setRowsBodegas] = useState<Bodega[]>([]);
  const [bodega, SetBodega] = useState(0);
  
  const handleCantidadChange = (index: number, nuevaCantidad: number) => {
    const actualizado = [...pedido];
    actualizado[index].cantidad = nuevaCantidad;
    actualizarPedido(actualizado);
  };

  const handleEliminar = (index: number) => {
    const actualizado = pedido.filter((_, i) => i !== index);
    actualizarPedido(actualizado);
  };

  const fetchBodega = async () => {
    try {
      const result = await serviciosBodega.traerTodo();
      setRowsBodegas(result);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };

  useEffect(() => {
    fetchBodega();
  }, []);
  const handleSeleccionarBodega = (event: SelectChangeEvent) => {
    SetBodega(Number(event.target.value));
  };

  const fetchEnviarSolicitud = async () => {
    if (bodega === 0) {
      alerta("Debes seleccionar una bodega", "info");
	  onClose();
      return;
    }
    if (pedido.length === 0) {
		alerta("No hay productos en el pedido", "warning");
		onClose();
		return;
    }
	
    const solicitudConBodega: InventarioSolicitud = {
		...data_solicitud,
		id_bodega_sol: bodega,
		pedido,
    };
	console.log(solicitudConBodega);
	
  await serviciosSol.solicitarInsumo(solicitudConBodega)
  .then(() => {
    alerta("Se envió la solicitud correctamente", "success");
    onClose();
  })
  .catch((error) => {
    console.error("Error al enviar solicitud:", error);
    alerta("Error al enviar solicitud", "error");
  });
  actualizarPedido([]);
  onClose();
  
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      //keepMounted
      onClose={onClose}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title">
        Listado de Productos en Pedido
      </DialogTitle>
      <DialogContent>
        <FormControl required sx={{ m: 1, minWidth: 120 }} error={bodega === 0}>
          <InputLabel id="bodega-label">Bodega</InputLabel>
          <Select
            labelId="bodega-label"
            id="select-bodega"
            value={bodega.toString()}
            label="Bodega *"
            onChange={handleSeleccionarBodega}
          >
            <MenuItem value={0}>
              <em>Seleccionar</em>
            </MenuItem>
            {rowsBodegas.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.nombre}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {bodega === 0 ? "Debes seleccionar una bodega" : " "}
          </FormHelperText>
        </FormControl>
        {pedido.length === 0 ? (
          <p>No hay productos en el pedido.</p>
        ) : (
          pedido.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: 1 }}>{item.nombre_producto}</span>
              <TextField
                label="Cantidad"
                type="number"
                size="small"
                value={item.cantidad}
                onChange={(e) =>
                  handleCantidadChange(index, parseInt(e.target.value) || 0)
                }
                inputProps={{ min: 1 }}
                sx={{ width: "100px" }}
              />
              <IconButton onClick={() => handleEliminar(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={fetchEnviarSolicitud} color="primary">
          Realizar Pedido
        </Button>
        <Button onClick={onClose} color="error">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

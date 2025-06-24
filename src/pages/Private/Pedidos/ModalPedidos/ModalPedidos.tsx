"use client";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BtnCancelar, BtnGuardar } from "../../../../components";
import { crearInventarioServicios } from "../../../../lib/inventario/aplicacion/inventarioServicios";
import { Inventario, ListaPedido } from "../../../../lib/inventario/dominio";
import { MySQLInventarioRepositorio } from "../../../../lib/inventario/infraestructura/mySQLInventarioRepositorio";
import { AppStore } from "../../../../lib/usuario/dominio";
import "./ModalPedidos.css";
import { ModalDataStylePedidos } from "./stylesModal";

type EstadosPedidosModalPedidos = {
  id_solicitud: number;
  nombre_bodega: string;
  fecha_emision: string;
  fecha_aprobado: string;
  usuario_solicitante: string;
  usuario_aprobador: string;
  productos: ListaPedido[];
  activo?: number;
};

export type ModalPedidosProps = {
  open: boolean;
  onClose: () => void;
  row: ListaPedido[];
  setRow: (val: ListaPedido[]) => void;
  text?: string;
  data: EstadosPedidosModalPedidos;
};

const ModalPedidos: React.FC<ModalPedidosProps> = ({
  open,
  onClose,
  row,
  setRow,
  text = "Lista de insumos",
  data,
}) => {
  const repositorio = MySQLInventarioRepositorio();
  const serviciosInventario = crearInventarioServicios(repositorio);
  const userState = useSelector((store: AppStore) => store.usuario);
  const [lista, setLista] = useState<Inventario[]>([]); //aqui va todolo que tiene la bodega

  useEffect(() => {
    fetchCantidadInsumos();
    console.log("use effect");
    console.log("data:", data);
  }, []);

  const fetchCantidadInsumos = async () => {
    try {
      const respuesta = await serviciosInventario.traerTodo(
        userState.id_bodega
      );
      setLista(respuesta);
    } catch (error) {
      //alerta("Error al entregar insumos", "error");
      if (error instanceof SyntaxError) {
        console.error("Error de formato en JSON modal Pedidos:", error.message);
      } else {
        console.error("Error al guardar modal Pedidos:", error);
      }
    }
  };

  const enviarInsumos = async () => {
    console.log("enviar");
    const productos_aprobados = row.map((l) => ({
      id_detalle_solicitud: l.id_detalle_solicitud ?? -1,
      cantidad_a_enviar: l.cantidad_enviada || 0,
      id_kardex_per: l.id_kardex || 0,
      id_producto_per: l.id_producto_per
    }));

    const envio = {
      id_solicitud: data.id_solicitud,
      id_usuario_aprueba: userState.id,
      productos_aprobados,
    };

    console.log("Formulario a enviar:", envio);
    try {
      await serviciosInventario.aprobarSolicitudYGenerarMovimientos(data.id_solicitud,userState.id,productos_aprobados);

    } catch (error) {
      //alerta("Error al entregar insumos", "error");
      if (error instanceof SyntaxError) {
        console.error("Error al enviar a aprobar solicitud:", error.message);
      } else {
        console.error("Error al enviar a aprobar solicitud:", error);
      }
    }
    salirModal();
  };
  const salirModal = () => {
    onClose();
  };
  return (
    <div className="modalpedidos">
      <Modal
        open={open}
        onClose={salirModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={ModalDataStylePedidos}>
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
                  type="number"
                  sx={{ width: "15%" }}
                  margin="normal"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //talvez se puede optimizar
                    if (!data.activo) {
                      setRow(
                        row.map((l) => {
                          const valor_validado = Number.isNaN(
                            parseInt(e.target.value)
                          )
                            ? 0
                            : parseInt(e.target.value);
                          let valor =
                            fila.id_detalle_solicitud === l.id_detalle_solicitud
                              ? valor_validado
                              : l.cantidad_enviada;

                          const cantidad_max: number =
                            lista.find(
                              (k) => k.id_producto_per == fila.id_producto_per
                            ) === undefined
                              ? 0
                              : lista.find(
                                  (e) =>
                                    e.id_producto_per == fila.id_producto_per
                                )?.cantidad || 0;
                          if (valor > cantidad_max) {
                            valor = l.cantidad_enviada;
                          }

                          return {
                            ...l,
                            cantidad_enviada: valor,
                          };
                        })
                      );
                    }
                  }}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max:
                        lista.find(
                          (e) => e.id_producto_per == fila.id_producto_per
                        ) === undefined
                          ? 0
                          : lista.find(
                              (e) => e.id_producto_per == fila.id_producto_per
                            )?.cantidad,
                    },
                  }}
                  helperText={
                    lista.find(
                      (e) => e.id_producto_per === fila.id_producto_per
                    ) === undefined
                      ? "S/I"
                      : ""
                  }
                  error={
                    lista.find(
                      (e) => e.id_producto_per == fila.id_producto_per
                    ) === undefined
                  }
                  color={
                    (row.find((l) => l.id_producto_per == fila.id_producto_per)
                      ?.cantidad_enviada || 0) > fila.cantidad
                      ? "warning"
                      : "primary"
                  }
                />
              </div>
            );
          })}
          <BtnGuardar
            texto="Enviar"
            habilitar={data.activo?true:false}
            mensajeConfirmacion="Desea enviar estos insumos?"
            handleGuardar={enviarInsumos}
          />
          <BtnCancelar onClose={salirModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default ModalPedidos;

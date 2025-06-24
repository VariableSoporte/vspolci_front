"use client";
import Button from "@mui/material/Button";
import React from "react";
import "./BtnSalir.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUser } from "../../../redux/states/user";
import { PublicRoutes } from "../../../models";

export type BtnSalirProps = {
  // types...
};

export const BtnSalir: React.FC<BtnSalirProps> = ({}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	function handleSalir () {
		dispatch(resetUser());
		navigate(`/${PublicRoutes.LOGIN}`, {replace: true});

	}

  return (
    <Button variant="outlined" onClick={handleSalir} color="error">
      SALIR
    </Button>
  );
};

export default BtnSalir;

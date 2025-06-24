"use client";
import React from "react";
import "./CardsReportes.css";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export type CardsReportesProps = {
  valor: number;
  titulo: string;
  contenido: string;
};

export const CardsReportes: React.FC<CardsReportesProps> = ({valor, titulo, contenido}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <Typography gutterBottom variant="h3" component="div">
          {valor}
        </Typography>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {titulo}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {contenido}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};


"use client";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivatesRoutes } from "../../models";
import { Home } from "./Home";


export const Private = ({}) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={PrivatesRoutes.HOME} />} />
        <Route path={`${PrivatesRoutes.HOME}`} element={<Home />} />
      </Routes>
    </>
  );
};

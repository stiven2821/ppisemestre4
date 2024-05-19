import React from "react";
import PrivateRoute from "./PrivateRoute";
import Cookies from "js-cookie";
import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import Noticias from "../pages/Noticias";
import Conocenos from "../pages/Conocenos"
import Dashboard from "../pages/Dashboard"
import Error from "../pages/Error"

const Routers = () => {
  const token = Cookies.get("token")
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Noticias" element={<Noticias/>}/>
        <Route path="/Conocenos" element={<Conocenos/>}/>
        <Route 
          path="/Dashboard/*"
          element = {
            <PrivateRoute token={token} redirectTo={"/"}>
              <Dashboard/>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Error/>}/>

    </Routes>
  )
}

export default Routers
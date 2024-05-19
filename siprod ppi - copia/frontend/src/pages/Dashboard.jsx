import React from "react";
import Inicio from "./Dashboard/inicio";
import Usuarios from "./Dashboard/usuarios";
import Sidebar from "../components/sidebar";
import News from "./Dashboard/News";

import { Routes, Route } from "react-router-dom";


const Dashboard = () => {
  return (
    <>
      <div className="d-flex">
        <div className="sidebar">
        <Sidebar/>
        </div>
        <section className="content">
        
          <div className="container-fluid p-3">
          <Routes>
            <Route path="" exact = {true} element = {<Inicio/>}/>
            <Route path="Usuarios" exact = {true} element = {<Usuarios/>}/>
            <Route path="News" exact = {true} element = {<News/>}/>
          </Routes>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;

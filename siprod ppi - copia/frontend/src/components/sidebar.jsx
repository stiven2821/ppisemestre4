import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2';

const Sidebar = () => {
  const token = Cookies.get("token");
  let usuario = null;

  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    usuario = tokenData.nombre;
  }
  useEffect(() => {
    const toggle = document.querySelector(".toggle");
    const menuDashboard = document.querySelector(".menu-dashboard");
    const iconoMenu = toggle.querySelector("i");
    const enlacesMenu = document.querySelectorAll(".enlace");

    const toggleMenu = () => {
      menuDashboard.classList.toggle("open");

      if (iconoMenu.classList.contains("bx-menu")) {
        iconoMenu.classList.replace("bx-menu", "bx-x");
      } else {
        iconoMenu.classList.replace("bx-x", "bx-menu");
      }
    };

    const handleMenuClick = () => {
      menuDashboard.classList.add("open");
      iconoMenu.classList.replace("bx-menu", "bx-x");
    };

    toggle.addEventListener("click", toggleMenu);

    enlacesMenu.forEach((enlace) => {
      enlace.addEventListener("click", handleMenuClick);
    });

    return () => {
      toggle.removeEventListener("click", toggleMenu);
      enlacesMenu.forEach((enlace) => {
        enlace.removeEventListener("click", handleMenuClick);
      });
    };
  }, []);

  const salir = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      confirmButtonColor: "#109DFA",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#EF280F",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="menu-dashboard">
      <div className="top-menu">
        <div className="logo icon">
          <img src="/assets/img/logoInverso (1).png" alt="" />
          <span>{usuario}</span>
        </div>
        <div className="toggle">
          <i className="bx bx-menu icon"></i>
        </div>
      </div>

      <div className="menu pt-5">

        <NavLink to = "Usuarios" className="enlace icon">
          <i className="bx bx-user "></i>
          <span>Usuarios</span>
        </NavLink>

        <NavLink to = "News" className="enlace icon">
          <i className="bx bx-grid-alt "></i>
          <span>Noticias</span>
        </NavLink>

        <NavLink className="enlace icon" onClick={salir}>
          <i className="bx bx-cog "></i>
          <span>Cerrar sesión</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

import React, {useEffect} from "react";
import { Link, Element } from "react-scroll";
import logo from "/assets/img/logoInverso.png";
import { NavLink, Navigate } from "react-router-dom";
import Login from "./Login";
import Registro from "./Registro";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Header = () => {
  const token = Cookies.get("token");
  let rol = null;

  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    rol = tokenData.rol;
  }
  
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
    <>
      <Login />
      <Registro />
      <header>
        {/* <!--header--> */}
        <nav
          className="navbar navbar-expand-md bg-dark fixed-top"
          data-bs-theme="dark"
        >
          <div className="container px-5">
            <a className="navbar-brand" href="">
              <img src={logo} alt="logo" width="70px" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink className="nav-link px-3" aria-current="page" to="/">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link
                    to="miFooter"
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    style={{ cursor: "pointer" }}
                    className="nav-link px-3"
                  >
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3" to="/Conocenos">
                    Conocenos
                  </NavLink>
                </li>

                {token && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link px-3" to="/Noticias">
                        Noticias
                      </NavLink>
                    </li>
                    {rol === 2 && (
                      <li className="nav-item">
                        <NavLink className="nav-link px-3" to="/Dashboard">
                          Administrador
                        </NavLink>
                      </li>
                    )}
                    <li className="nav-item">
                      <NavLink className="nav-link px-3" onClick={salir}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-box-arrow-left"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                          />
                        </svg>
                      </NavLink>
                    </li>
                  </>
                )}
                {!token && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#inicioSesion"
                        >
                          Iniciar sesión
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#registro"
                        >
                          Registrarse
                        </a>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;

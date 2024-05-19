import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const valorInicial = {
    inputCorreo: "",
    inputPass: "",
  };
  const [values, setValues] = useState(valorInicial);
  const [nombre, setNombre] = useState(""); // Agrego un estado para almacenar el nombre

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      setNombre(tokenData.nombre);
    }
  }, []);

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    const login = {
      correo: values.inputCorreo,
      contrasenia: values.inputPass,
    };
    try {
      const respuesta = await axios.post("http://localhost:4000/api/ingresar", login);
      if (respuesta.status === 200) {
        const token = respuesta.data.token; // Corrijo la variable response por respuesta
        Cookies.set("token", token);

        Swal.fire({
          icon: "success",
          title: "Inicio exitoso",
          text: "Bienvenido " + nombre, // Utilizo el nombre del estado
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/"
          }
        })
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al iniciar sesión",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud POST: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión, intente nuevamente",
      });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="inicioSesion"
        aria-labelledby="inicioSesionLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="inicioSesion">
                Inicio sesión
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row g-3" onSubmit={enviarDatos}>
                <div className="mb-3">
                  <label htmlFor="inputCorreo" className="form-label">
                    Correo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCorreoL"
                    placeholder="poli@correo.com"
                    name="inputCorreo"
                    value={values.inputCorreo}
                    onChange={capturarDatos}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="inputPass" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPass"
                    placeholder="Contraseña1234"
                    name="inputPass"
                    value={values.inputPass}
                    onChange={capturarDatos}
                  />
                </div>
                <input type="submit" className="btn btn-primary" value="ingresar" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

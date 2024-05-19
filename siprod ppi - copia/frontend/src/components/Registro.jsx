import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Registro = () => {
  const valorInicial = {
    inputCedula: "",
    inputNombre: "",
    inputApellido1: "",
    inputApellido2: "",
    inputFechaNac: "",
    inputTelefono: "",
    inputCorreo: "",
    inputContraseña1: "",
    inputContraseña2: "",
  };
  const [values, setValues] = useState(valorInicial);
  const resetUsuario = () => {
    setValues(valorInicial);
  };
  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validarContraseña = () => {
    const { inputContraseña1, inputContraseña2 } = values;
    if (inputContraseña1 !== inputContraseña2) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden",
      });
      return false;
    }
    if (inputContraseña1.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La contraseña debe tener al menos 8 caracteres",
      });
      return false;
    }
    return true;
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    if (!validarContraseña()) {
      return;
    }
    const newUser = {
      cedula: values.inputCedula,
      nombre: values.inputNombre,
      p_apellido: values.inputApellido1,
      s_apellido: values.inputApellido2,
      fecha_nac: values.inputFechaNac,
      correo: values.inputCorreo,
      contrasenia: values.inputContraseña1, // Aquí incluyes la contraseña 1
      contrasenia2: values.inputContraseña2, // Aquí incluyes la contraseña 2
      telefono: values.inputTelefono,
    };
    console.log(newUser);
    try {
      // Realizar la solicitud POST
      await axios.post("http://localhost:4000/api/registrar", newUser);
  
      // Mostrar mensaje de éxito utilizando SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Cuenta creada con éxito",
      }).then((result) => {
        if (result.isConfirmed) {
          // Realizar acciones adicionales después de la creación de la cuenta
          resetUsuario(); // Reiniciar los valores del formulario
          // Aquí puedes agregar cualquier otra acción que desees realizar después de la creación de la cuenta
        }
      });
    } catch (error) {
      // Manejar errores en la solicitud POST
      console.error("Error en la solicitud POST:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear la cuenta.",
      });
    }
  };
  
  return (
    <>
      <div
        className="modal fade"
        id="registro"
        aria-labelledby="registroLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="registro">
                Registro
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
                <div className="col-md-6">
                  <label htmlFor="inputCedula" className="form-label">
                    Cedula<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="inputCedula"
                    name="inputCedula"
                    value={values.inputCedula}
                    onChange={capturarDatos}
                    placeholder="2435673828"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputNombre" className="form-label">
                    Nombre<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNombre"
                    name="inputNombre"
                    value={values.inputNombre}
                    onChange={capturarDatos}
                    placeholder="Pepe"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputApellido1" className="form-label">
                    Primer Apellido<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputApellido1"
                    name="inputApellido1"
                    value={values.inputApellido1}
                    onChange={capturarDatos}
                    placeholder="Yepes"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputApellido2" className="form-label">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputApellido2"
                    name="inputApellido2"
                    value={values.inputApellido2}
                    onChange={capturarDatos}
                    placeholder="Zapata"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputFechaNac" className="form-label">
                    Fecha de nacimiento<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="Date"
                    className="form-control"
                    id="inputFechaNac"
                    name="inputFechaNac"
                    value={values.inputFechaNac}
                    onChange={capturarDatos}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputTelefono" className="form-label">
                    Telefono<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="inputTelefono"
                    name="inputTelefono"
                    value={values.inputTelefono}
                    onChange={capturarDatos}
                    placeholder="3156782402"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputCorreo" className="form-label">
                    Correo electronico<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputCorreo"
                    name="inputCorreo"
                    value={values.inputCorreo}
                    onChange={capturarDatos}
                    placeholder="pepito@correo.com"
                    required
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="inputContraseña1" className="form-label">
                    Contraseña<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputContraseña1"
                    name="inputContraseña1"
                    value={values.inputContraseña1}
                    onChange={capturarDatos}
                    placeholder="Pepe1234"
                    required
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="inputContraseña2" className="form-label">
                    Confirmar contraseña<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputContraseña2"
                    name="inputContraseña2"
                    value={values.inputContraseña2}
                    onChange={capturarDatos}
                    placeholder="Pepe1234"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  value="Enviar"
                >
                  Registrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registro;

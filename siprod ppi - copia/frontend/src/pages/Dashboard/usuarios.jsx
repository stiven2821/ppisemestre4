import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { Modal, Button } from "react-bootstrap";

const usuarios = () => {
  const valorInicial = {
    rol: "0",
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
  const [Roles, setRoles] = useState([]);
  const [selectedRol, setselectedRoles] = useState("");

  const [editRolSelected, setEditRolSelected] = useState("");

  const [Usuarios, setUsuarios] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Usuarios.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchUsuarios();
  }, [Usuarios]);

  const fetchUsuarios = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:4000/api/usuarios/mostrar"
      );
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error("error al obtener los usuarios: ", error);
    }
  };

  useEffect(() => {
    const obtenerRoles = async () => {
      const respuesta = await axios.get("http://localhost:4000/api/roles");
      setRoles(respuesta.data);
    };
    obtenerRoles();
  }, [Roles]);

  const resetUsuario = () => {
    setValues(valorInicial);
  };
  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const enviarDatos = async (e) => {
    e.preventDefault();
    const newUser = {
      rol: selectedRol,
      cedula: values.inputCedula,
      nombre: values.inputNombre,
      p_apellido: values.inputApellido1,
      s_apellido: values.inputApellido2,
      fecha_nac: values.inputFechaNac,
      correo: values.inputCorreo,
      contrasenia: values.inputContraseña1,
      telefono: values.inputTelefono,
    };
    console.log(newUser);
    try {
      // Realizar la solicitud POST
      await axios.post("http://localhost:4000/api/usuarios/crear", newUser);

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

  //borrar
  const borrarUsuario = async (cedula) => {
    try {
      // Realizar la solicitud DELETE
      await axios.delete(`http://localhost:4000/api/usuarios/borrar/${cedula}`);

      // Mostrar mensaje de éxito utilizando SweetAlert2 o alguna otra librería
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario eliminado con éxito",
      }).then((result) => {
        if (result.isConfirmed) {
          // Realizar acciones adicionales después de borrar al usuario si es necesario
          fetchUsuarios(); // Actualizar la lista de usuarios después del borrado
        }
      });
    } catch (error) {
      // Manejar errores en la solicitud DELETE
      console.error("Error al borrar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar el usuario.",
      });
    }
  };
  //editar usuario
  const [editUsuarioId, setEditUsuarioId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const handleEdit = (cedula) => {
    setEditUsuarioId(cedula);
    setShow(true);
    const usuario = Usuarios.find((usuario) => usuario.cedula === cedula);
    setEditValues({
      editRol: editRolSelected,
      editCedula: usuario.cedula,
      editNombre: usuario.nombre,
      editP_apellido: usuario.p_apellido,
      editS_apellido: usuario.s_apellido,
      editFecha_nac: usuario.fecha,
      editCorreo: usuario.correo,
      editContrasenia: "",
      editTelefono: usuario.telefono,
    });
  };
  const capturarEdit = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };
  const actualizarUsuario = async (e, id) => {
    e.preventDefault();

    const actualizarUsuario = {
      rol: editValues.editRol,
      cedula: editValues.editCedula,
      nombre: editValues.editNombre,
      p_apellido: editValues.editApellido1,
      s_apellido: editValues.editApellido2,
      fecha_nac: editValues.editFecha,
      correo: editValues.editCorreo,
      contrasenia: editValues.editContrasenia,
      telefono: editValues.editTelefono,
    };
    console.log(actualizarUsuario);
    try {
      await axios.put(
        `http://localhost:4000/api/usuarios/editar/${id}`,
        actualizarUsuario
      );
      await Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario actualizado con éxito",
      }).then((result) => {
        if (result.isConfirmed) {
          fetchUsuarios();
          handleClose();
        }
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el usuario.",
      });
    }
  };
  return (
    <>
      <section className="container-sm">
        <div className="card">
          <form className="row g-3 p-3" onSubmit={enviarDatos}>
            <div className="col-md-12">
              <label htmlFor="inputRol" className="form-label">
                Rol
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectedRol}
                onChange={(e) => setselectedRoles(e.target.value)}
              >
                <option>Seleccione un rol</option>
                {Roles.map((roles) => (
                  <option key={roles.id} value={roles.id}>
                    {roles.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCedula" className="form-label">
                Cedula
              </label>
              <input
                type="number"
                className="form-control"
                id="inputCedula"
                placeholder="1000546789"
                name="inputCedula"
                value={values.inputCedula}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCorreo" className="form-label">
                Correo electronico
              </label>
              <input
                type="email"
                className="form-control"
                id="inputCorreo"
                placeholder="usuario123@elpoli.edu.co"
                name="inputCorreo"
                value={values.inputCorreo}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-4">
              <label htmlFor="inputNombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="inputNombre"
                placeholder="John"
                name="inputNombre"
                value={values.inputNombre}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-4">
              <label htmlFor="inputApellido1" className="form-label">
                Primer Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="inputApellido1"
                placeholder="Doe"
                name="inputApellido1"
                value={values.inputApellido1}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-4">
              <label htmlFor="inputApellido2" className="form-label">
                Segundo Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="inputApellido2"
                placeholder="Zuluaga"
                name="inputApellido2"
                value={values.inputApellido2}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-6">
              <label htmlFor="inputContraseña1" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="inputContraseña1"
                placeholder="pepe12345"
                name="inputContraseña1"
                value={values.inputContraseña1}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-6">
              <label htmlFor="inputContraseña2" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="inputContraseña2"
                placeholder="pepe12345"
                name="inputContraseña2"
                value={values.inputContraseña2}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputFecha" className="form-label">
                Fecha De Nacimiento
              </label>
              <input
                type="date"
                className="form-control"
                id="inputFecha"
                name="inputFechaNac"
                value={values.inputFechaNac}
                onChange={capturarDatos}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputTelefono" className="form-label">
                Teléfono
              </label>
              <input
                type="tel"
                className="form-control"
                id="inputTelefono"
                placeholder="3169845678"
                name="inputTelefono"
                value={values.inputTelefono}
                onChange={capturarDatos}
              />
            </div>

            <div className="d-grid gap-2 col-6 mx-auto">
              <button type="submit" className="btn btn-primary">
                Registrar
              </button>
            </div>
          </form>

          <div className="table-responsive mt-5 p-3">
            <table className="table table-striped table-hover table-bordered ">
              <thead>
                <tr className="table-dark">
                  <th scope="col">Cedula</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Telefono</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((usuario) => (
                  <tr key={usuario.cedula}>
                    <th scope="row">{usuario.cedula}</th>
                    <td>{usuario.nombre_rol}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono}</td>
                    <td>{format(new Date(usuario.fecha), "dd/MM/yyyy")}</td>
                    <td>
                      <div
                        className="btn-group btn-group-sm d-flex justify-content-center"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleEdit(usuario.cedula)}
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => borrarUsuario(usuario.cedula)}>
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <ul className="pagination">
                {Array.from({
                  length: Math.ceil(Usuarios.length / itemsPerPage),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {Usuarios.map((usuario) => (
        <Modal key={usuario.cedula} show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="row g-3" onSubmit={actualizarUsuario}>
              <div className="col-md-12">
                <label htmlFor="inputRol" className="form-label">
                  Rol
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={editRolSelected}
                  onChange={(e) => setEditRolSelected(e.target.value)}
                >
                  <option value="0">Seleccione un rol</option>
                  {Roles.map((roles) => (
                  <option key={roles.id} value={roles.id}>
                    {roles.id}
                  </option>
                ))}
                </select>
              </div>
              <div className="col-md-6">
                <label
                  htmlFor={`editCedula${usuario.cedula}`}
                  className="form-label"
                >
                  Cedula
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`editCedula${usuario.cedula}`}
                  placeholder="1000546789"
                  name="editCedula"
                  value={editValues.editCedula}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor={`editCorreo${usuario.cedula}`}
                  className="form-label"
                >
                  Correo electronico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id={`editCorreo${usuario.cedula}`}
                  placeholder="usuario123@elpoli.edu.co"
                  name="editCorreo"
                  value={editValues.editCorreo}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-4">
                <label
                  htmlFor={`editNombre${usuario.cedula}`}
                  className="form-label"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`editNombre${usuario.cedula}`}
                  placeholder="John"
                  name="editNombre"
                  value={editValues.editNombre}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-4">
                <label
                  htmlFor={`editApellido1${usuario.cedula}`}
                  className="form-label"
                >
                  Primer Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`editApellido1${usuario.cedula}`}
                  placeholder="Doe"
                  name="editApellido1"
                  value={editValues.editApellido1}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-4">
                <label
                  htmlFor={`editApellido2${usuario.cedula}`}
                  className="form-label"
                >
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`editApellido2${usuario.cedula}`}
                  placeholder="Zuluaga"
                  name="editApellido2"
                  value={editValues.editApellido2}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-6">
                <label
                  htmlFor={`editContraseña1${usuario.cedula}`}
                  className="form-label"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id={`editContraseña1${usuario.cedula}`}
                  placeholder="pepe12345"
                  name="editContraseña1"
                  value={editValues.editContraseña1}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-6">
                <label
                  htmlFor={`editContraseña2${usuario.cedula}`}
                  className="form-label"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id={`editContraseña2${usuario.cedula}`}
                  placeholder="pepe12345"
                  name="editContraseña2"
                  value={editValues.editContraseña2}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor={`editFechaNac${usuario.cedula}`}
                  className="form-label"
                >
                  Fecha De Nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  id={`editFechaNac${usuario.cedula}`}
                  name="editFechaNac"
                  value={editValues.editFechaNac}
                  onChange={capturarEdit}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor={`editTelefono${usuario.cedula}`}
                  className="form-label"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id={`editTelefono${usuario.cedula}`}
                  placeholder="3169845678"
                  name="editTelefono"
                  value={editValues.editTelefono}
                  onChange={capturarEdit}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={(e) => actualizarUsuario(e, editUsuarioId)}
            >
              Actualizar
            </Button>
          </Modal.Footer>
        </Modal>
      ))}
    </>
  );
};

export default usuarios;

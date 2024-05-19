const { Router } = require("express");

const { crearUsuario, mostrarUsuarios, editarUsuarios, borrarUsuario } = require("../controller/usuario.controller");

const router = Router();

router.route("/usuarios/crear").post(crearUsuario);

router.route("/usuarios/mostrar").get(mostrarUsuarios);

router.route("/usuarios/editar/:id").put(editarUsuarios);

router.route("/usuarios/borrar/:id").delete(borrarUsuario);

module.exports = router;

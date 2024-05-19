const { Router } = require("express");
const { autRequired } = require("../middleweares/validateToken");
const { registrarUsuario, ingresar, cerrarSesion } = require("../controller/auth.controller");
const router = Router();
router.route("/registrar").post(registrarUsuario);
router.route("/ingresar").post(ingresar);
router.route("/salir").post(cerrarSesion);

module.exports = router;

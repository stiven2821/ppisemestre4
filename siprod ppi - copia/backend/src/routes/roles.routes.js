const { Router } = require("express");
const { obtenerRoles} = require("../controller/roles.controller");
const router = Router();
router.route("/roles").get(obtenerRoles);

module.exports = router;
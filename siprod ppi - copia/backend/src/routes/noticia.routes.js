const { Router } = require("express");
const { nuevaNoticia, mostrarNoticias} = require("../controller/noticias.controller");
const router = Router();
router.route("/noticias").post(nuevaNoticia);
router.route("/noticias").get(mostrarNoticias);

module.exports = router;
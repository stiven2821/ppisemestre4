const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const app = express();

const authRoutes = require("./routes/aut.routes")
const usuarioRoutes = require("./routes/usuario.routes")
const rolesRoutes = require("./routes/roles.routes")
const noticiaRoutes = require("./routes/noticia.routes")

//configuracion
app.set("port", process.env.PORT || 4000);

// Configuración de CORS
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

//middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


//rutas
app.get("/", (req, res) => {
  res.send("bienvenido a mi api rest full");
});

app.use("/api", authRoutes)
app.use("/api", usuarioRoutes)
app.use("/api", rolesRoutes)
app.use("/api", noticiaRoutes)


module.exports = app;

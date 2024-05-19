const bcrypt = require("bcrypt");
const { createAccessToken } = require("../libs/jwt");
const DataBase = require("../database");

const authCtrl = {};

authCtrl.registrarUsuario = async (req, res) => {
  const {
    cedula,
    nombre,
    p_apellido,
    s_apellido,
    fecha_nac,
    correo,
    contrasenia,
    contrasenia2,
    telefono,
  } = req.body;
  try {
    if (contrasenia === contrasenia2) {
      const contra_encryp = await bcrypt.hash(contrasenia, 10);

      // Convertir la fecha de nacimiento al formato DD/MM/YYYY
      const formattedFechaNac = fecha_nac.split("-").reverse().join("/");

      // Consulta SQL para insertar un nuevo usuario
      const query = `
        INSERT INTO usuarios (identificacion, nombre, p_apellido, s_apellido, fecha_nacimiento, correo, contrasenia, telefono, rol_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, 1)
      `;

      // Abre la conexión a la base de datos
      await DataBase.openConnection();

      // Ejecuta la consulta SQL
      await DataBase.executeQuery(query, [
        cedula,
        nombre,
        p_apellido,
        s_apellido,
        formattedFechaNac,
        correo,
        contra_encryp,
        telefono,
      ]);

      // Generar token de acceso y enviar respuesta
      const token = await createAccessToken({ id: cedula });
      res.cookie("token", token);
      return res.json({
        message: "Usuario creado",
      });
    }
    return res.status(400).json({
      message: "Las contraseñas no coinciden",
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error del servidor", message: error.message });
  }
};

authCtrl.ingresar = async (req, res) => {
  const { correo, contrasenia } = req.body;
  try {
    // Consulta SQL para obtener el usuario por su correo
    const query = `SELECT * FROM usuarios WHERE correo = $1`;

    // Ejecuta la consulta SQL
    const resultado = await DataBase.executeQuery(query, [correo]);

    // Verifica si se encontró el usuario
    if (resultado.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Obtiene la contraseña almacenada en la base de datos
    const contraseniaDb = resultado.rows[0].contrasenia;

    // Compara la contraseña proporcionada con la contraseña almacenada
    const coincide = await bcrypt.compare(contrasenia, contraseniaDb);

    // Verifica si las contraseñas coinciden
    if (!coincide) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crea un token de acceso con los datos del usuario
    const token = await createAccessToken({
      cedula: resultado.rows[0].identificacion,
      nombre: resultado.rows[0].nombre,
      p_apellido: resultado.rows[0].p_apellido,
      s_apellido: resultado.rows[0].s_apellido,
      fecha_nac: resultado.rows[0].fecha_nacimiento,
      correo: resultado.rows[0].correo,
      telefono: resultado.rows[0].telefono,
      rol: resultado.rows[0].rol_id,
    });

    // Establece el token en una cookie y envía la respuesta
    res.cookie("token", token);
    res.json({ message: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
};

authCtrl.cerrarSesion = async (req, res) => {
  // Establece la fecha de expiración de la cookie
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);

  // Elimina la cookie de la sesión y envía una respuesta exitosa
  res.cookie("token", "", {
    expires: expirationDate,
  });
  return res.sendStatus(200);
};

module.exports = authCtrl;

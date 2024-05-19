const bcrypt = require("bcrypt");
const { createAccessToken } = require("../libs/jwt");
const DataBase = require("../database");
const moment = require("moment");

const usuarioCtrl = {};

usuarioCtrl.crearUsuario = async (req, res) => {
  const {
    cedula,
    nombre,
    p_apellido,
    s_apellido,
    fecha_nac,
    correo,
    contrasenia,
    telefono,
    rol,
  } = req.body;

  try {
    // Encriptar la contraseña
    const contra_encryp = await bcrypt.hash(contrasenia, 10);

    // Establecer el rol predeterminado si no se proporciona
    const rolDefecto = rol || 1;

    // Convertir la fecha de nacimiento al formato DD/MM/YYYY
    const formattedFechaNac = moment(fecha_nac).format("DD/MM/YYYY");

    // Consulta SQL para insertar un nuevo usuario
    const query = `INSERT INTO usuarios (identificacion, nombre, p_apellido, s_apellido, fecha_nacimiento, correo, contrasenia, telefono, rol_id, estado)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)`;

    // Ejecutar la consulta SQL
    await DataBase.executeQuery(query, [cedula, nombre, p_apellido, s_apellido, formattedFechaNac, correo, contra_encryp, telefono, rolDefecto]);

    // Crear un token de acceso para el usuario creado
    const token = await createAccessToken({ id: cedula });

    // Establecer el token en una cookie y enviar la respuesta
    res.cookie("token", token);
    res.json({ message: "Usuario creado" });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ error: "Error del servidor", message: error.message });
  }
};

usuarioCtrl.mostrarUsuarios = async (req, res) => {
  try {
    // Consulta SQL para obtener todos los usuarios con sus roles
    const query = `SELECT u.identificacion as cedula,
                          u.nombre,
                          u.p_apellido as apellido1,
                          u.s_apellido as apellido2,
                          u.fecha_nacimiento as fecha,
                          u.correo,
                          u.contrasenia,
                          u.telefono,
                          u.rol_id as rol,
                          u.estado,
                          r.nombre as nombre_rol
                   FROM usuarios u
                   LEFT JOIN roles r ON u.rol_id = r.id
                   WHERE u.estado = 1
                   ORDER BY u.identificacion DESC`;

    // Ejecutar la consulta SQL
    const resultado = await DataBase.executeQuery(query, [], false);

    // Mapear los resultados en el formato deseado
    const usuarios = resultado.rows.map((usuario) => ({
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      fecha: usuario.fecha,
      correo: usuario.correo,
      contrasenia: usuario.contrasenia,
      telefono: usuario.telefono,
      rol: usuario.rol,
      estado: usuario.estado,
      nombre_rol: usuario.nombre_rol,
    }));

    // Enviar los usuarios como respuesta
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

usuarioCtrl.borrarUsuario = async (req, res) => {
  const { id } = req.params; // Suponiendo que el ID del usuario está en los parámetros de la solicitud

  try {
    // Verificar si el usuario existe
    const usuarioExistenteQuery = `SELECT identificacion FROM usuarios WHERE identificacion = $1`;
    const usuarioExistente = await DataBase.executeQuery(usuarioExistenteQuery, [id]);

    // Si el usuario no existe, devolver un error 404
    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    // Consulta SQL para cambiar el estado del usuario a "eliminado" (estado 2)
    const deleteQuery = `UPDATE usuarios 
                         SET estado = 2 
                         WHERE identificacion = $1`;

    // Ejecutar la consulta SQL
    await DataBase.executeQuery(deleteQuery, [id]);

    // Enviar una respuesta exitosa
    res.json({
      message: "Usuario eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    res.status(500).json({ error: "Error del servidor", message: error.message });
  }
};

usuarioCtrl.editarUsuarios = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nombre,
      p_apellido,
      s_apellido,
      fecha_nac,
      correo,
      contrasenia,
      telefono,
      rol,
    } = req.body;

    // Obtener la contraseña existente del usuario desde la base de datos
    const usuarioQuery = `SELECT * FROM usuarios WHERE identificacion = $1`;
    const usuarioResult = await DataBase.executeQuery(usuarioQuery, [id]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña si se proporciona
    let contraseniaBd = null;
    if (contrasenia) {
      contraseniaBd = await bcrypt.hash(contrasenia, 10);
    }

    // Convertir la fecha de nacimiento al formato DD/MM/YYYY
    const formattedFechaNac = moment(fecha_nac).format("DD/MM/YYYY");

    // Consulta SQL para actualizar los datos del usuario
    const updateQuery = `UPDATE usuarios 
                         SET 
                           nombre = ($2),
                           p_apellido = ($3),
                           s_apellido = ($4),
                           fecha_nacimiento = (TO_DATE($5, 'DD/MM/YYYY')),
                           correo = ($6),
                           contrasenia = ($7),
                           telefono = ($8),
                           rol_id = ($9)
                         WHERE
                           identificacion = $1`;

    // Ejecutar la consulta SQL
    const resultado = await DataBase.executeQuery(updateQuery, [id, nombre, p_apellido, s_apellido, formattedFechaNac, correo, contraseniaBd, telefono, rol]);

    // Verificar si la actualización fue exitosa
    if (resultado.rowCount > 0) {
      res.json({ message: "Usuario actualizado" });
    } else {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res.status(500).json({ error: "Error del servidor", message: error.message });
  }
};


module.exports = usuarioCtrl;

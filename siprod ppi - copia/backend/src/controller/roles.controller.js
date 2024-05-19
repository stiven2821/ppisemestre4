const DataBase = require("../database");

const rolCtrl = {};

rolCtrl.obtenerRoles = async (req, res) => {
    try {
      // Consulta SQL para obtener todos los roles
      const query = `SELECT * FROM roles`;
  
      // Ejecutar la consulta SQL
      const resultado = await DataBase.executeQuery(query, [], false);
  
      // Mapear los resultados en el formato deseado
      const roles = resultado.rows.map((rol) => ({
        id: rol.id,
        nombre: rol.nombre,
      }));
  
      // Enviar los roles como respuesta
      res.json(roles);
    } catch (error) {
      console.error("Error al obtener los roles:", error.message);
      res.status(500).json({ error: "Error al obtener los roles" });
    }
  };

module.exports = rolCtrl;

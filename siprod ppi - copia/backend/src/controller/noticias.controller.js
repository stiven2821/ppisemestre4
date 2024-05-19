const DataBase = require("../database");
const moment = require("moment");

const noticiasCtrl = {};

noticiasCtrl.nuevaNoticia = async (req, res) => {
  const {
    titulo,
    descripcion,
    url_imagen,
    fecha_publicacion,
    usuario,
  } = req.body;

  try {
    // Convertir la fecha de publicación al formato DD/MM/YYYY
    const formattedFechaPub = moment(fecha_publicacion).format("DD/MM/YYYY");

    // Consulta SQL para insertar una nueva noticia
    const query = `INSERT INTO noticias (id, titulo, descripcion, url_imagen, fecha_publicacion, usuario)
                   VALUES (nextval('seq_noticias'), $1, $2, $3, $4, $5)`;

    // Ejecutar la consulta SQL
    await DataBase.executeQuery(query, [titulo, descripcion, url_imagen, formattedFechaPub, usuario]);

    // Enviar respuesta exitosa
    res.json({ message: "Noticia subida con éxito" });
  } catch (error) {
    console.error("Error al subir el contenido:", error);
    res.status(500).json({ error: "Error del servidor", message: error.message });
  }
};

module.exports = noticiasCtrl;


noticiasCtrl.mostrarNoticias = async (req, res) => {
  try {
    // Consulta SQL para obtener todas las noticias
    const query = `SELECT id, titulo, descripcion, url_imagen, fecha_publicacion, fecha_edicion, usuario FROM noticias`;

    // Ejecutar la consulta SQL
    const resultado = await DataBase.executeQuery(query, [], false);

    // Mapear los resultados en el formato deseado
    const noticias = resultado.rows.map((noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      url_imagen: noticia.url_imagen,
      fecha_publicacion: noticia.fecha_publicacion,
      fecha_edicion: noticia.fecha_edicion,
      usuario: noticia.usuario,
    }));

    // Enviar las noticias como respuesta
    res.json(noticias);
  } catch (error) {
    console.error("Error al obtener las noticias:", error.message);
    res.status(500).json({ error: "Error al obtener las noticias" });
  }
};

module.exports = noticiasCtrl;

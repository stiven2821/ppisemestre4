// Importar el módulo moment(fechas y horas) y el controlador de noticias
const moment = require("moment");
const noticiasCtrl = require("../controller/noticias.controller");
const DataBase = require("../database");

// Mockear(simular) la base de datos para las pruebas
jest.mock("../database");

// Describir el conjunto de pruebas para el controlador de noticias
describe("noticiasCtrl", () => {
  // Describir las pruebas para el método nuevaNoticia
  describe("nuevaNoticia", () => {
    let req, res;

    // Configurar el entorno de prueba antes de cada prueba
    beforeEach(() => {
      // Configurar la solicitud y la respuesta
      req = {
        body: {
          titulo: "Título de la noticia",
          descripcion: "Descripción de la noticia",
          url_imagen: "http://example.com/imagen.jpg",
          fecha_publicacion: "2024-04-15",
          usuario: "usuario123",
        },
      };
      res = {
        json: jest.fn(), // Mockear la función json
        status: jest.fn(() => res), // Mockear la función status
      };
    });

    // Prueba: debería insertar una nueva noticia en la base de datos y devolver 200
    it("debería insertar una nueva noticia en la base de datos y devolver 200", async () => {
      // Mockear la ejecución de la consulta SQL
      DataBase.executeQuery.mockResolvedValueOnce();

      // Llamar al método nuevaNoticia con la solicitud y la respuesta configuradas
      await noticiasCtrl.nuevaNoticia(req, res);

      // Verificar que la consulta SQL se haya llamado con los parámetros correctos
      expect(DataBase.executeQuery).toHaveBeenCalledWith(expect.any(String), [
        req.body.titulo,
        req.body.descripcion,
        req.body.url_imagen,
        expect.any(String),
        req.body.usuario,
      ]);

      // Verificar que se haya enviado una respuesta JSON con el mensaje esperado
      expect(res.json).toHaveBeenCalledWith({ message: "Noticia subida con éxito" });
    });

    // Prueba: debería devolver 500 si ocurre un error al insertar la noticia
    it("debería devolver 500 si ocurre un error al insertar la noticia", async () => {
      // Mensaje de error simulado
      const errorMessage = "Error al insertar la noticia en la base de datos";

      // Mockear el rechazo de la ejecución de la consulta SQL con un error
      DataBase.executeQuery.mockRejectedValueOnce(new Error(errorMessage));

      // Llamar al método nuevaNoticia con la solicitud y la respuesta configuradas
      await noticiasCtrl.nuevaNoticia(req, res);

      // Verificar que la consulta SQL se haya llamado
      expect(DataBase.executeQuery).toHaveBeenCalled();

      // Verificar que se haya enviado una respuesta de estado 500 con el mensaje de error
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error del servidor", message: errorMessage });
    });
  });

  // Describir las pruebas para el método mostrarNoticias
  describe("mostrarNoticias", () => {
    let req, res;

    // Configurar el entorno de prueba antes de cada prueba
    beforeEach(() => {
      // Configurar la solicitud y la respuesta
      req = {};
      res = {
        json: jest.fn(), // Mockear la función json
        status: jest.fn(() => res), // Mockear la función status
      };
    });

    // Prueba: debería devolver todas las noticias y devolver 200
    it("debería devolver todas las noticias y devolver 200", async () => {
      // Noticias simuladas
      const noticiasMock = [
        {
          id: 1,
          titulo: "Noticia 1",
          descripcion: "Descripción de la noticia 1",
          url_imagen: "http://example.com/imagen1.jpg",
          fecha_publicacion: "2024-04-15",
          fecha_edicion: "2024-04-16",
          usuario: "usuario123",
        },
        {
          id: 2,
          titulo: "Noticia 2",
          descripcion: "Descripción de la noticia 2",
          url_imagen: "http://example.com/imagen2.jpg",
          fecha_publicacion: "2024-04-16",
          fecha_edicion: "2024-04-17",
          usuario: "usuario456",
        },
      ];

      // Mockear la ejecución de la consulta SQL y devolver las noticias simuladas
      DataBase.executeQuery.mockResolvedValueOnce({ rows: noticiasMock });

      // Llamar al método mostrarNoticias con la solicitud y la respuesta configuradas
      await noticiasCtrl.mostrarNoticias(req, res);

      // Verificar que la consulta SQL se haya llamado
      expect(DataBase.executeQuery).toHaveBeenCalled();

      // Verificar que se haya enviado una respuesta JSON con las noticias simuladas
      expect(res.json).toHaveBeenCalledWith(noticiasMock);
    });

    // Prueba: debería devolver 500 si ocurre un error al obtener las noticias
    it("debería devolver 500 si ocurre un error al obtener las noticias", async () => {
      // Mensaje de error simulado
      const errorMessage = "Error al obtener las noticias de la base de datos";

      // Mockear el rechazo de la ejecución de la consulta SQL con un error
      DataBase.executeQuery.mockRejectedValueOnce(new Error(errorMessage));

      // Llamar al método mostrarNoticias con la solicitud y la respuesta configuradas
      await noticiasCtrl.mostrarNoticias(req, res);

      // Verificar que la consulta SQL se haya llamado
      expect(DataBase.executeQuery).toHaveBeenCalled();

      // Verificar que se haya enviado una respuesta de estado 500 con el mensaje de error
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener las noticias" });
    });
  });
});

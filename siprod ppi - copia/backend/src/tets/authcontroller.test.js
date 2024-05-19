// Importar los módulos necesarios y el controlador de autenticación
const bcrypt = require("bcrypt");
const authCtrl = require("../controller/auth.controller");
const { createAccessToken } = require("../libs/jwt");
const DataBase = require("../database");

// Mockear los módulos necesarios
jest.mock("bcrypt"); // Mockear el módulo bcrypt
jest.mock("../libs/jwt"); // Mockear el módulo jwt
jest.mock("../database"); // Mockear el módulo database

// Describir el conjunto de pruebas para el controlador de autenticación
describe("authCtrl", () => {
  // Describir las pruebas para el método registrarUsuario
  describe("registrarUsuario", () => {
    let req, res;

    // Configurar el entorno de prueba antes de cada prueba
    beforeEach(() => {
      // Configurar la solicitud y la respuesta
      req = {
        body: {
          cedula: "123456789",
          nombre: "Juan",
          p_apellido: "Pérez",
          s_apellido: "Gómez",
          fecha_nac: "1990-01-01",
          correo: "juan@example.com",
          contrasenia: "password123",
          contrasenia2: "password123",
          telefono: "123456789",
        },
      };
      res = {
        json: jest.fn(), // Mockear la función json
        status: jest.fn(() => res), // Mockear la función status
        cookie: jest.fn(), // Mockear la función cookie
      };
    });

    // Prueba: debería devolver 400 si las contraseñas no coinciden
    it("debería devolver 400 si las contraseñas no coinciden", async () => {
      // Modificar la solicitud para que las contraseñas no coincidan
      req.body.contrasenia2 = "contraseñaDiferente";

      // Llamar al método registrarUsuario con la solicitud y la respuesta configuradas
      await authCtrl.registrarUsuario(req, res);

      // Verificar que se haya devuelto un estado 400 con el mensaje adecuado
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Las contraseñas no coinciden" });
    });

    // Prueba: debería devolver 500 si ocurre un error durante la operación de base de datos
    it("debería devolver 500 si ocurre un error durante la operación de base de datos", async () => {
      // Simular un error durante la conexión a la base de datos
      DataBase.openConnection.mockRejectedValueOnce(new Error("Error de conexión a la base de datos"));

      // Llamar al método registrarUsuario con la solicitud y la respuesta configuradas
      await authCtrl.registrarUsuario(req, res);

      // Verificar que se haya devuelto un estado 500 con el mensaje adecuado
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error del servidor", message: "Error de conexión a la base de datos" });
    });

    // Prueba: debería crear un usuario y devolver 200 con entradas válidas
    it("debería crear un usuario y devolver 200 con entradas válidas", async () => {
      // Simular el hash de la contraseña y la ejecución exitosa de la consulta SQL
      bcrypt.hash.mockResolvedValue("contraseñaEncriptada");
      DataBase.executeQuery.mockResolvedValueOnce();

      // Llamar al método registrarUsuario con la solicitud y la respuesta configuradas
      await authCtrl.registrarUsuario(req, res);

      // Verificar que se haya establecido una cookie y devuelto un estado 200 con el mensaje adecuado
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario creado" });
    });
  });

  // Describir las pruebas para el método ingresar
  describe("ingresar", () => {
    // Configurar la solicitud y la respuesta antes de cada prueba
    let req, res;
    beforeEach(() => {
      req = {
        body: {
          correo: "juan@example.com",
          contrasenia: "password123",
        },
      };
      res = {
        json: jest.fn(), // Mockear la función json
        status: jest.fn(() => res), // Mockear la función status
        cookie: jest.fn(), // Mockear la función cookie
      };
    });

    // Prueba: debería devolver 400 si el usuario no se encuentra
    it("debería devolver 400 si el usuario no se encuentra", async () => {
      // Simular una respuesta vacía de la base de datos
      DataBase.executeQuery.mockResolvedValueOnce({ rows: [] });

      // Llamar al método ingresar con la solicitud y la respuesta configuradas
      await authCtrl.ingresar(req, res);

      // Verificar que se haya devuelto un estado 400 con el mensaje adecuado
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
    });

    // Prueba: debería devolver 401 si la contraseña es incorrecta
    it("debería devolver 401 si la contraseña es incorrecta", async () => {
      // Simular una contraseña incorrecta en la base de datos
      DataBase.executeQuery.mockResolvedValueOnce({ rows: [{ contrasenia: "contraseñaEncriptada" }] });
      bcrypt.compare.mockResolvedValueOnce(false);

      // Llamar al método ingresar con la solicitud y la respuesta configuradas
      await authCtrl.ingresar(req, res);

      // Verificar que se haya devuelto un estado 401 con el mensaje adecuado
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Contraseña incorrecta" });
    });

    // Prueba: debería crear un token y devolver 200 si el usuario se encuentra y la contraseña es correcta
    it("debería crear un token y devolver 200 si el usuario se encuentra y la contraseña es correcta", async () => {
      // Definir un usuario y un token esperado
      const usuario = {
        identificacion: "123456789",
        nombre: "Juan",
        p_apellido: "Pérez",
        s_apellido: "Gómez",
        fecha_nacimiento: "1990-01-01",
        correo: "juan@example.com",
        telefono: "123456789",
        rol_id: 1,
      };
      const tokenEsperado = "tokenGenerado";
      // Simular una respuesta de la base de datos con el usuario
      DataBase.executeQuery.mockResolvedValueOnce({ rows: [usuario] });
      // Simular una comparación de contraseña exitosa y la generación de un token exitosa
      bcrypt.compare.mockResolvedValueOnce(true);
      createAccessToken.mockResolvedValueOnce(tokenEsperado);

      // Llamar al método ingresar con la solicitud y la respuesta configuradas
      await authCtrl.ingresar(req, res);

      // Verificar que se haya establecido una cookie y devuelto un estado 200 con el mensaje adecuado
      expect(res.cookie).toHaveBeenCalledWith("token", tokenEsperado);
      expect(res.json).toHaveBeenCalledWith({ message: "Inicio de sesión exitoso", token: tokenEsperado });
    });
  });

  // Describir las pruebas para el método cerrarSesion
  describe("cerrarSesion", () => {
    // Prueba: debería limpiar la cookie de token y devolver 200
    it("debería limpiar la cookie de token y devolver 200", async () => {
      // Configurar la solicitud y la respuesta
      const req = {};
      const res = {
        cookie: jest.fn(), // Mockear la función cookie
        sendStatus: jest.fn(), // Mockear la función sendStatus
      };

      // Llamar al método cerrarSesion con la solicitud y la respuesta configuradas
      await authCtrl.cerrarSesion(req, res);

      // Verificar que se haya limpiado la cookie de token y devuelto un estado 200
      expect(res.cookie).toHaveBeenCalledWith("token", "", { expires: expect.any(Date) });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});


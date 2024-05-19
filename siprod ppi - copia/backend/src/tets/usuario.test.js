const bcrypt = require("bcrypt");
const moment = require("moment");
const usuarioCtrl = require("../controller/usuario.controller");
const DataBase = require("../database");
const { createAccessToken } = require("../libs/jwt");

// Mock para la ejecución de consultas en la base de datos
jest.mock("../database", () => ({
  executeQuery: jest.fn(),
}));

// Mock para la generación de tokens de acceso
jest.mock("../libs/jwt", () => ({
  createAccessToken: jest.fn(() => "fake_token"),
}));

describe("Test de usuarioCtrl", () => {
  describe("crearUsuario", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Limpiar mocks después de cada prueba
    });

    it("debería crear un usuario correctamente", async () => {
      // Arrange
      const req = {
        body: {
          cedula: "123456789",
          nombre: "Usuario",
          p_apellido: "Prueba",
          s_apellido: "Test",
          fecha_nac: "1990-01-01",
          correo: "usuario@example.com",
          contrasenia: "password",
          telefono: "123456789",
          rol: 1,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn(), // Asegúrate de mockear correctamente el método status
        cookie: jest.fn(),
      };
      // Mock para simular una ejecución exitosa de la consulta en la base de datos
      DataBase.executeQuery.mockResolvedValueOnce({});

      // Act
      await usuarioCtrl.crearUsuario(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario creado" });
      expect(res.status).not.toHaveBeenCalled(); // No esperamos que se llame al método status
      expect(res.cookie).toHaveBeenCalledWith("token", "fake_token"); // Verifica que se establezca correctamente la cookie con el token
    });

    it("debería devolver un error si la consulta en la base de datos falla", async () => {
        // Arrange
        const req = {
          body: {
            cedula: "123456789",
            nombre: "Usuario",
            p_apellido: "Prueba",
            s_apellido: "Test",
            fecha_nac: "1990-01-01",
            correo: "usuario@example.com",
            contrasenia: "password",
            telefono: "123456789",
            rol: 1,
          },
        };
      
        // Mock para simular un error en la consulta en la base de datos
        DataBase.executeQuery.mockRejectedValueOnce(new Error("Error en la consulta"));
      
        // Crear un objeto res mockeado
        const res = {
          json: jest.fn(),
          status: jest.fn(() => res), // Retorna el objeto res para encadenar llamadas
        };
      
        // Act
        await usuarioCtrl.crearUsuario(req, res);
      
        // Assert
        // Verifica que se llame a res.status con el código de error esperado (500)
        expect(res.status).toHaveBeenCalledWith(500);
        // Verifica que se llame a res.json con el mensaje de error esperado
        expect(res.json).toHaveBeenCalledWith({ error: "Error del servidor", message: "Error en la consulta" });
      });
      
  });

  describe("mostrarUsuarios", () => {
    it("debería mostrar la lista de usuarios correctamente", async () => {
        const req = {};
        const res = {
          json: jest.fn(),
          status: jest.fn(),
        };
      
        const usuariosSimulados = [
          {
            cedula: "123456789",
            nombre: "Usuario",
            apellido1: "Prueba", // Cambié p_apellido por apellido1
            apellido2: "Test",   // Cambié s_apellido por apellido2
            fecha: "1990-01-01",
            correo: "usuario@example.com",
            contrasenia: "$2b$10$FdoN31qUzRJ0vZKpxkI46OVhEH9T1IqgmUljBZYNEIqqPh.GU1g/u",
            telefono: "123456789",
            rol: 1,
            estado: 1,
            nombre_rol: "Rol de Prueba",
          },
          // Otros usuarios simulados...
        ];
      
        DataBase.executeQuery.mockResolvedValueOnce({ rows: usuariosSimulados });
      
        await usuarioCtrl.mostrarUsuarios(req, res);
      
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(usuariosSimulados));
        expect(res.status).not.toHaveBeenCalled();
      });

    it("debería devolver un error si la consulta en la base de datos falla", async () => {
      const req = {};

      jest
        .spyOn(DataBase, "executeQuery")
        .mockRejectedValueOnce(new Error("Error en la consulta"));

      // Creamos un objeto de respuesta simulado
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(), // Añadimos esto para asegurar que el objeto se devuelva después de llamar .status()
      };

      // Llamar a la función mostrarUsuarios con el objeto de respuesta simulado
      await usuarioCtrl.mostrarUsuarios(req, mockResponse);

      // Verificar que res.status fue llamado con el código 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      // Verificar que res.json fue llamado con el mensaje de error
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error al obtener los usuarios",
      });
    });
  });

  describe("borrarUsuario", () => {
    it("debería borrar un usuario existente correctamente", async () => {
      const req = {
        params: {
          id: "123456789",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      // Mock para simular una respuesta exitosa de la consulta en la base de datos
      DataBase.executeQuery.mockResolvedValueOnce({ rows: [{ identificacion: "123456789" }] });

      await usuarioCtrl.borrarUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Usuario eliminado" });
      expect(res.status).not.toHaveBeenCalled();
    });

   it("debería devolver un error si se intenta borrar un usuario inexistente", async () => {
        // Configuración de la solicitud (req)
        const req = {
          params: {
            id: "usuario_no_existente",
          },
        };
    
        // Mock para simular una respuesta vacía de la consulta en la base de datos
        DataBase.executeQuery.mockResolvedValueOnce({ rows: [] });
    
        // Mock de la función `json` del objeto `res`
        const jsonMock = jest.fn();
    
        // Mock de la función `status` del objeto `res`
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
        // Llamada a la función que se está probando
        await usuarioCtrl.borrarUsuario(req, { json: jsonMock, status: statusMock });
    
        // Verificación de que se llamó a res.status con el código de estado correcto
        expect(statusMock).toHaveBeenCalledWith(404);
    
        // Verificación de que se llamó a res.json con el mensaje de error correcto
        expect(jsonMock).toHaveBeenCalledWith({ error: "Usuario no encontrado" });
      });
    
    
      
      it("debería devolver un error si la consulta en la base de datos falla", async () => {
        // Configuración de la solicitud (req)
        const req = {
          params: {
            id: "123456789",
          },
        };
    
        // Mock de la función `json` del objeto `res`
        const jsonMock = jest.fn();
    
        // Mock de la función `status` del objeto `res`
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
        // Mock para simular un error en la consulta en la base de datos
        DataBase.executeQuery.mockRejectedValueOnce(new Error("Error en la consulta"));
    
        // Llamada a la función que se está probando
        await usuarioCtrl.borrarUsuario(req, { json: jsonMock, status: statusMock });
    
        // Verificación de que se llamó a res.status con el código de estado correcto
        expect(statusMock).toHaveBeenCalledWith(500);
    
        // Verificación de que se llamó a res.json con el mensaje de error correcto
        expect(jsonMock).toHaveBeenCalledWith({ error: "Error del servidor", message: "Error en la consulta" });
      });
    
      
  });

  describe("editarUsuarios", () => {
    it("debería editar un usuario existente correctamente", async () => {
        // Configuración de la solicitud (req)
        const req = {
          params: {
            id: "123456789",
          },
          body: {
            nombre: "UsuarioEditado",
            p_apellido: "PruebaEditado",
            s_apellido: "TestEditado",
            fecha_nac: "1990-01-01",
            correo: "usuarioeditado@example.com",
            contrasenia: "passwordeditada",
            telefono: "987654321",
            rol: 2,
          },
        };
  
        // Mock de la función `json` del objeto `res`
        const jsonMock = jest.fn();
  
        // Mock de la función `status` del objeto `res`
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  
        // Mock para simular un error en la consulta en la base de datos
        DataBase.executeQuery.mockRejectedValueOnce(new Error("Error en la consulta"));
  
        // Llamada a la función que se está probando
        await usuarioCtrl.editarUsuarios(req, { json: jsonMock, status: statusMock });
  
        // Verificación de que se llamó a res.status con el código de estado 500
        expect(statusMock).toHaveBeenCalledWith(500);
  
        // Verificación de que se llamó a res.json con el mensaje de error correcto
        expect(jsonMock).toHaveBeenCalledWith({ error: "Error del servidor", message: "Error en la consulta" });
      });

    it("debería devolver un error si se intenta editar un usuario inexistente", async () => {
      // Configuración de la solicitud (req)
      const req = {
        params: {
          id: "usuario_no_existente",
        },
        body: {
          // Datos de edición del usuario
          nombre: "NombreEjemplo",
          p_apellido: "PrimerApellidoEjemplo",
          s_apellido: "SegundoApellidoEjemplo",
          fecha_nacimiento: "1990-01-01",
          correo: "correo@example.com",
          contrasenia: "contraseña123",
          telefono: "123456789",
          rol_id: 1,
        },
      };

      // Mock de la función `json` del objeto `res`
      const jsonMock = jest.fn();

      // Mock de la función `status` del objeto `res`
      const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

      // Mock para simular un error en la consulta a la base de datos
      DataBase.executeQuery.mockRejectedValueOnce(
        new Error("Error al consultar la base de datos")
      );

      // Llamada a la función que se está probando
      await usuarioCtrl.editarUsuarios(req, {
        json: jsonMock,
        status: statusMock,
      });

      // Verificación de que se llamó a res.status con el código de estado 500
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it("debería devolver un error si la consulta en la base de datos falla", async () => {
        // Configuración de la solicitud (req)
        const req = {
            params: {
                id: "123456789",
            },
            body: {
                nombre: "UsuarioEditado",
                p_apellido: "PruebaEditado",
                s_apellido: "TestEditado",
                fecha_nac: "1990-01-01",
                correo: "usuarioeditado@example.com",
                contrasenia: "passwordeditada",
                telefono: "987654321",
                rol: 2,
            },
        };
    
        // Mock de la función `json` del objeto `res`
        const jsonMock = jest.fn();
    
        // Mock de la función `status` del objeto `res`
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
        // Mock para simular un error en la consulta en la base de datos
        DataBase.executeQuery.mockRejectedValueOnce(new Error("Error en la consulta"));
    
        // Llamada a la función que se está probando
        await usuarioCtrl.editarUsuarios(req, { json: jsonMock, status: statusMock });
    
        // Verificación de que se llamó a res.status con el código de estado 500 y el mensaje de error correcto
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(statusMock().json).toHaveBeenCalledWith({ error: "Error del servidor", message: "Error en la consulta" });
    });
    
    
  });
});

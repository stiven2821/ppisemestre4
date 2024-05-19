// Importar el controlador de roles y el módulo de base de datos
const rolCtrl = require('../controller/roles.controller'); // Asegúrate de que la ruta sea correcta
const DataBase = require('../database');

// Mock de la función executeQuery de DataBase
jest.mock('../database', () => ({
  executeQuery: jest.fn(), // Mockear la función executeQuery
}));

// Describir el conjunto de pruebas para el método obtenerRoles del controlador de roles
describe('Pruebas para obtenerRoles', () => {
  // Limpiar los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Prueba: debería obtener roles exitosamente
  it('debería obtener roles exitosamente', async () => {
    // Mock de filas de roles
    const mockRows = [
      { id: 1, nombre: 'Admin' },
      { id: 2, nombre: 'Usuario' },
    ];

    // Mock de executeQuery para simular una respuesta exitosa
    DataBase.executeQuery.mockResolvedValueOnce({ rows: mockRows });

    // Mock de req y res para simular la solicitud y respuesta HTTP
    const req = {};
    const res = {
      json: jest.fn(), // Mock de la función json
      status: jest.fn(() => res), // Mock de la función status
    };

    // Llamar al método obtenerRoles con la solicitud y la respuesta configuradas
    await rolCtrl.obtenerRoles(req, res);

    // Verificar que se llamó a executeQuery con la consulta correcta
    expect(DataBase.executeQuery).toHaveBeenCalledWith('SELECT * FROM roles', [], false);

    // Verificar que se llamó a res.json con los roles correctamente mapeados
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, nombre: 'Admin' },
      { id: 2, nombre: 'Usuario' },
    ]);

    // Verificar que no se llamó a res.status
    expect(res.status).not.toHaveBeenCalled();
  });
});

// Describir el conjunto de pruebas para manejo de errores en obtenerRoles del controlador de roles
describe('Pruebas para manejo de errores en obtenerRoles', () => {
  // Limpiar los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Prueba: debería llamar a res.json en caso de error
  it('debería llamar a res.json en caso de error', async () => {
    const errorMessage = 'Error al obtener los roles';

    // Mock de executeQuery para simular un error
    DataBase.executeQuery.mockRejectedValueOnce(new Error(errorMessage));

    // Mock de req y res para simular la solicitud y respuesta HTTP
    const req = {};
    const res = {
      json: jest.fn(), // Mock de la función json
      status: jest.fn(() => res), // Mock de la función status
    };

    try {
      // Llamar al método obtenerRoles con la solicitud y la respuesta configuradas
      await rolCtrl.obtenerRoles(req, res);

      // Si la función se completa sin errores, la prueba falla
      fail('Se esperaba un error pero la función se completó sin errores');
    } catch (error) {
      // Verificar que se llamó a res.json con el mensaje de error correcto
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });

      // Verificar que se llamó a res.status con el código de estado 500
      expect(res.status).toHaveBeenCalledWith(500);
    }
  });
});

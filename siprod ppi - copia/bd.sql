-- Eliminar tablas si existen
DROP TABLE IF EXISTS noticias;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS estados;
DROP TABLE IF EXISTS usuarios;

-- Crear tabla NOTICIAS
CREATE TABLE noticias (
    id               SERIAL PRIMARY KEY,
    titulo           VARCHAR(30) NOT NULL,
    descripcion      VARCHAR(255) NOT NULL,
    url_imagen       VARCHAR(255) NOT NULL,
    fecha_publicacion DATE NOT NULL,
    fecha_edicion    DATE,
    usuario          VARCHAR(15) NOT NULL
);

-- Crear tabla ROLES
CREATE TABLE roles (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

-- Crear tabla ESTADOS
CREATE TABLE estados (
    id   SERIAL PRIMARY KEY,
    tipo VARCHAR(15) NOT NULL
);

-- Crear tabla USUARIOS
CREATE TABLE usuarios (
    identificacion   VARCHAR(15) PRIMARY KEY,
    nombre           VARCHAR(30) NOT NULL,
    p_apellido       VARCHAR(20) NOT NULL,
    s_apellido       VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    correo           VARCHAR(100) NOT NULL,
    contrasenia      VARCHAR(255) NOT NULL,
    telefono         NUMERIC(15) NOT NULL,
    rol_id           INTEGER NOT NULL,
    estado           INTEGER NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (estado) REFERENCES estados(id)
);

-- Claves autoincrementables
CREATE SEQUENCE seq_roles START 1;
CREATE SEQUENCE seq_estados START 1;
CREATE SEQUENCE seq_noticias START 1;

ALTER TABLE roles ALTER COLUMN id SET DEFAULT nextval('seq_roles');
ALTER TABLE estados ALTER COLUMN id SET DEFAULT nextval('seq_estados');
ALTER TABLE noticias ALTER COLUMN id SET DEFAULT nextval('seq_noticias');

-- Insertar datos en tablas
INSERT INTO roles (nombre) VALUES (:nombre);

INSERT INTO estados (tipo) VALUES (:tipo);

-- Realizar las actualizaciones de usuarios
UPDATE usuarios SET estado = 2 WHERE identificacion = :id;

UPDATE usuarios 
SET 
    nombre = COALESCE(:nombre, nombre),
    p_apellido = COALESCE(:p_apellido, p_apellido),
    s_apellido = COALESCE(:s_apellido, s_apellido),
    fecha_nacimiento = COALESCE(:fecha_nacimiento, fecha_nacimiento),
    correo = COALESCE(:correo, correo),
    contrasenia = COALESCE(:contrasenia, contrasenia),
    telefono = COALESCE(:telefono, telefono),
    rol_id = COALESCE(:rol_id, rol_id)
WHERE
    identificacion = :id;
    
UPDATE usuarios SET rol_id = 2 WHERE identificacion = 234556786;

-- Mostrar información de usuarios
SELECT * FROM usuarios WHERE identificacion = :id;

SELECT inet_server_addr() AS host;

INSERT INTO roles (id, nombre)
VALUES (2, 'admin')

SELECT * FROM roles

UPDATE usuarios SET rol_id = 2
WHERE identificacion = '1000987489'

UPDATE usuarios 
SET 
    nombre = COALESCE('estiven', nombre),
    p_apellido = COALESCE('', p_apellido),
    s_apellido = COALESCE('', s_apellido),
    fecha_nacimiento = COALESCE(TO_DATE('', 'DD/MM/YYYY'), fecha_nacimiento),
    correo = COALESCE('', correo),
    contrasenia = COALESCE('', contrasenia),
    telefono = COALESCE(, telefono),
    rol_id = COALESCE('', rol_id)
WHERE
    identificacion = '1000987489';




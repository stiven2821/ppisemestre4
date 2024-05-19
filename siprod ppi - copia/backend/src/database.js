const { Pool } = require('pg');

/*const DbConfig= {
  user: 'daqkzixw',
  host: 'ruby.db.elephantsql.com',
  database: 'daqkzixw',
  password: 's-APOi58DSM4l55fWUsR4N3GoPaEedKq',
  port: 5432, // Puerto por defecto de PostgreSQL
};*/

const DbConfig= {
  user: 'postgres',
  host: 'localhost',
  database: 'siprod',
  password: 'stiven2128',
  port: 5432, // Puerto por defecto de PostgreSQL
};

const pool = new Pool(DbConfig);

const openConnection = async () => {
  try {
    await pool.connect();
    console.log("Conexión establecida con PostgreSQL");
  } catch (error) {
    console.error("Error al establecer la conexión:", error.message);
    throw error;
  }
};

const executeQuery = async (sql, values) => {
  try {
    const result = await pool.query(sql, values);
    console.log("Consulta ejecutada");
    return result;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    throw error;
  }
};

module.exports = {
  openConnection,
  executeQuery,
};




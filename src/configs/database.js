var database = {
development: {
  host: 'localhost',
  user: 'root',
  password: 'contraseña',
  port: 3306,
  database: 'crudnodejsmysql'
},
production: {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
};


module.exports = database;

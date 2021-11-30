const Pool = require('pg').Pool;
const pool = new Pool({
 user: "postgres",
 password: "Eluylikool",
 database: "homework4",
 host: "localhost",
 port: "5432"
});
module.exports = pool;

const mysql = require('mysql');


const databaseConnect = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "cs2300isKewl!",
    database: "CollisionCenter",
    multipleStatements: true,
    connectionLimit: 10
});

module.exports = {databaseConnect};
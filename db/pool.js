require("dotenv").config();
const mysql2 = require("mysql2/promise");

const rawHost = process.env.HOST || "localhost";
let mysqlHost = rawHost;
let mysqlPort = Number(process.env.MYSQL_PORT || 3306);
if (rawHost.includes(":")) {
    const [hostPart, portPart] = rawHost.split(":");
    mysqlHost = hostPart;
    if (portPart) {
        const parsedPort = Number(portPart);
        if (!Number.isNaN(parsedPort)) {
            mysqlPort = parsedPort;
        }
    }
}

const pool = mysql2.createPool({
    host: mysqlHost,
    port: mysqlPort,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
});

module.exports = pool;
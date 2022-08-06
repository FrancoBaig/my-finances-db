const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.HOST,
	user: process.env.USER,
	database: process.env.DB,
	password: process.env.PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

module.exports = pool.promise();

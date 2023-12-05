const mysql = require("mysql");

const fs = require("fs");
const con = mysql.createConnection({
  host: "villamarina.mysql.database.azure.com",
  user: "azure",
  password: "Yang1234....",
  database: "villamarina",
  port: 3306,
  ssl: { ca: fs.readFileSync("./crt.pem") },
});

//mysql for localhost
/*const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "villamarina",
});*/

const DOMAIN = "https://hu1a1a.github.io/VillaMarina/#/";
//const DOMAIN = "http://localhost:4200/VillaMarina_Front/";

const ADMIN = "ADMIN";
const PASSWORD = "ADMIN";
const RESET = "RESETVILLAMARINA";

module.exports = {
  con,
  DOMAIN,
  ADMIN,
  PASSWORD,
  RESET,
};

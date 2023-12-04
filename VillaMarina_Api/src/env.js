const mysql = require("mysql");

const con = mysql.createConnection({
  host: "villamarina.mysql.database.azure.com",
  user: "azure",
  password: "Yang1234....",
  database: "villamarina",
});

//mysql for localhost
/*const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "villamarina",
});*/

const DOMAIN = "https://hu1a1a.github.io/VillaMarina/";
//const DOMAIN = "http://localhost:4200/VillaMarina_Front/";

const ADMIN = "ADMIN";
const PASSWORD = "ADMIN";

module.exports = {
  con,
  DOMAIN,
  ADMIN,
  PASSWORD,
};
